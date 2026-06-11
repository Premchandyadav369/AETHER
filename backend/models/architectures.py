import torch
import torch.nn as nn
import torch.nn.functional as F

class ProteinStructureEncoder(nn.Module):
    """
    ESM2-based Protein structure and sequence encoder.
    Extracts residue-level and global representation vectors.
    """
    def __init__(self, input_dim: int = 1280, hidden_dim: int = 512, output_dim: int = 256):
        super().__init__()
        self.fc1 = nn.Linear(input_dim, hidden_dim)
        self.ln1 = nn.LayerNorm(hidden_dim)
        self.fc2 = nn.Linear(hidden_dim, output_dim)
        self.dropout = nn.Dropout(0.15)
        
    def forward(self, x: torch.Tensor) -> torch.Tensor:
        # x shape: [batch_size, seq_len, input_dim] or [batch_size, input_dim]
        h = self.dropout(F.relu(self.ln1(self.fc1(x))))
        out = self.fc2(h)
        return out  # Shape: [batch_size, output_dim]

class GCNLayer(nn.Module):
    """Simple Graph Convolutional Network layer."""
    def __init__(self, in_features: int, out_features: int):
        super().__init__()
        self.linear = nn.Linear(in_features, out_features)
        
    def forward(self, x: torch.Tensor, adj: torch.Tensor) -> torch.Tensor:
        # x: Node features [batch_size, num_nodes, in_features]
        # adj: Adjacency matrix [batch_size, num_nodes, num_nodes]
        support = self.linear(x)
        # Add self-loops to adj
        deg = adj.sum(dim=-1, keepdim=True) + 1e-6
        deg_inv_sqrt = torch.pow(deg, -0.5)
        norm_adj = deg_inv_sqrt * adj * deg_inv_sqrt.transpose(-1, -2)
        out = torch.bmm(norm_adj, support)
        return F.relu(out)

class MolecularGraphEncoder(nn.Module):
    """GCN/GAT model for molecular graph representation from atom features and adjacency."""
    def __init__(self, atom_dim: int = 64, hidden_dim: int = 128, output_dim: int = 256):
        super().__init__()
        self.gcn1 = GCNLayer(atom_dim, hidden_dim)
        self.gcn2 = GCNLayer(hidden_dim, output_dim)
        
    def forward(self, atom_features: torch.Tensor, adj_matrix: torch.Tensor) -> torch.Tensor:
        h = self.gcn1(atom_features, adj_matrix)
        h = self.gcn2(h, adj_matrix)
        # Global pooling (mean pool across atom nodes)
        g_out = h.mean(dim=1)
        return g_out  # [batch_size, output_dim]

class CrossAttentionTransformer(nn.Module):
    """
    Protein-Ligand Cross-Attention block.
    Aligns protein pocket residue embeddings and ligand atom embeddings.
    """
    def __init__(self, embed_dim: int = 256, n_heads: int = 4):
        super().__init__()
        self.mha = nn.MultiheadAttention(embed_dim, n_heads, batch_first=True)
        self.norm = nn.LayerNorm(embed_dim)
        self.ffn = nn.Sequential(
            nn.Linear(embed_dim, embed_dim * 2),
            nn.ReLU(),
            nn.Linear(embed_dim * 2, embed_dim)
        )
        self.norm2 = nn.LayerNorm(embed_dim)
        
    def forward(self, query: torch.Tensor, key: torch.Tensor, value: torch.Tensor) -> tuple[torch.Tensor, torch.Tensor]:
        # query: Ligand atom features [batch_size, num_atoms, embed_dim]
        # key/value: Protein residues [batch_size, num_residues, embed_dim]
        attn_out, attn_weights = self.mha(query, key, value)
        h = self.norm(query + attn_out)
        ffn_out = self.ffn(h)
        out = self.norm2(h + ffn_out)
        return out, attn_weights

class BindingAffinityPredictor(nn.Module):
    """Predicts binding affinity (pKd/pKi) from protein-ligand representations."""
    def __init__(self, input_dim: int = 512, hidden_dim: int = 128):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(input_dim, hidden_dim),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(hidden_dim, 64),
            nn.ReLU(),
            nn.Linear(64, 1)  # Single affinity value output
        )
        
    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.net(x)

class ConditionalVAE(nn.Module):
    """Conditional Variational Autoencoder (CVAE) for protein-guided molecule generation."""
    def __init__(self, mol_dim: int = 256, protein_dim: int = 256, latent_dim: int = 64):
        super().__init__()
        # Encoder (q(z|x, c))
        self.enc_fc = nn.Linear(mol_dim + protein_dim, 128)
        self.fc_mu = nn.Linear(128, latent_dim)
        self.fc_logvar = nn.Linear(128, latent_dim)
        
        # Decoder (p(x|z, c))
        self.dec_fc1 = nn.Linear(latent_dim + protein_dim, 128)
        self.dec_fc2 = nn.Linear(128, mol_dim)
        
    def encode(self, mol_emb: torch.Tensor, prot_emb: torch.Tensor) -> tuple[torch.Tensor, torch.Tensor]:
        inputs = torch.cat([mol_emb, prot_emb], dim=-1)
        h = F.relu(self.enc_fc(inputs))
        return self.fc_mu(h), self.fc_logvar(h)
        
    def reparameterize(self, mu: torch.Tensor, logvar: torch.Tensor) -> torch.Tensor:
        std = torch.exp(0.5 * logvar)
        eps = torch.randn_like(std)
        return mu + eps * std
        
    def decode(self, z: torch.Tensor, prot_emb: torch.Tensor) -> torch.Tensor:
        inputs = torch.cat([z, prot_emb], dim=-1)
        h = F.relu(self.dec_fc1(inputs))
        return torch.sigmoid(self.dec_fc2(h))
        
    def forward(self, mol_emb: torch.Tensor, prot_emb: torch.Tensor) -> tuple[torch.Tensor, torch.Tensor, torch.Tensor]:
        mu, logvar = self.encode(mol_emb, prot_emb)
        z = self.reparameterize(mu, logvar)
        reconstruction = self.decode(z, prot_emb)
        return reconstruction, mu, logvar
