import os
import json
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D

# Paths
WORKSPACE = r"c:\Users\PREMCHANDYADAV\OneDrive\Desktop\Project\AETHERRAMI"
V4_DIR = os.path.join(WORKSPACE, "aether-ramiv4")
VIS_DIR = os.path.join(WORKSPACE, "visualizations")
os.makedirs(VIS_DIR, exist_ok=True)

PROTEINS = {
    "egfr": {"pdb_id": "1M17", "file": "1m17.pdb", "class": "Kinase", "ligand_name": "AQ4"},
    "braf": {"pdb_id": "1UWH", "file": "1uwh.pdb", "class": "Kinase", "ligand_name": "084"},
    "cdk2": {"pdb_id": "1HCK", "file": "1hck.pdb", "class": "Cell Cycle Kinase", "ligand_name": "PVB"},
    "hiv_protease": {"pdb_id": "1HVR", "file": "1hvr.pdb", "class": "Viral Aspartyl Protease", "ligand_name": "XK2"},
    "ache": {"pdb_id": "4EY7", "file": "4ey7.pdb", "class": "Neural Hydrolase", "ligand_name": "E20"}
}

def parse_pdb(pdb_path):
    """Parses a PDB file and returns atoms and hetatoms (ligand)."""
    atoms = []
    hetatoms = []
    
    if not os.path.exists(pdb_path):
        print(f"File not found: {pdb_path}")
        return atoms, hetatoms
        
    with open(pdb_path, 'r') as f:
        for line in f:
            if line.startswith("ATOM  "):
                # Parse ATOM record
                try:
                    serial = int(line[6:11].strip())
                    name = line[12:16].strip()
                    res_name = line[17:20].strip()
                    chain = line[21].strip()
                    res_seq = int(line[22:26].strip())
                    x = float(line[30:38].strip())
                    y = float(line[38:46].strip())
                    z = float(line[46:54].strip())
                    element = line[76:78].strip()
                    atoms.append({
                        "serial": serial, "name": name, "res_name": res_name,
                        "chain": chain, "res_seq": res_seq, "x": x, "y": y, "z": z, "element": element
                    })
                except Exception as e:
                    pass
            elif line.startswith("HETATM"):
                # Parse HETATM record (ligand, water, ions)
                try:
                    serial = int(line[6:11].strip())
                    name = line[12:16].strip()
                    res_name = line[17:20].strip()
                    chain = line[21].strip()
                    res_seq = int(line[22:26].strip())
                    x = float(line[30:38].strip())
                    y = float(line[38:46].strip())
                    z = float(line[46:54].strip())
                    element = line[76:78].strip()
                    # Skip water
                    if res_name not in ["HOH", "WAT"]:
                        hetatoms.append({
                            "serial": serial, "name": name, "res_name": res_name,
                            "chain": chain, "res_seq": res_seq, "x": x, "y": y, "z": z, "element": element
                        })
                except Exception as e:
                    pass
    return atoms, hetatoms

def calculate_pocket_and_interactions(atoms, hetatoms, ligand_name):
    """Finds pocket residues (within 5A of ligand) and computes interactions."""
    # Filter hetatoms for target ligand
    ligand_atoms = [h for h in hetatoms if ligand_name in h["res_name"]]
    if not ligand_atoms:
        # Fallback to any hetatoms if specific name not found
        ligand_atoms = [h for h in hetatoms if h["res_name"] not in ["HOH", "WAT"]]
        if ligand_atoms:
            ligand_name = ligand_atoms[0]["res_name"]
            
    if not ligand_atoms:
        return [], [], ligand_name
        
    pocket_residues = set()
    interactions = []
    
    # Calculate distances
    for la in ligand_atoms:
        la_coord = np.array([la["x"], la["y"], la["z"]])
        for a in atoms:
            a_coord = np.array([a["x"], a["y"], a["z"]])
            dist = np.linalg.norm(la_coord - a_coord)
            if dist < 5.0:
                pocket_residues.add((a["res_name"], a["res_seq"]))
                
                # Check for possible H-bonds (N/O to N/O, distance < 3.5A)
                if dist < 3.5 and la["element"] in ["N", "O"] and a["element"] in ["N", "O"]:
                    interactions.append({
                        "type": "H-Bond",
                        "residue": f"{a['res_name']}{a['res_seq']}",
                        "atom": la["name"],
                        "distance": round(dist, 2)
                    })
                # Check for hydrophobic contacts (C-C distance < 4.5A)
                elif dist < 4.5 and la["element"] == "C" and a["element"] == "C" and a["res_name"] in ["ALA", "VAL", "LEU", "ILE", "PRO", "PHE", "TRP", "MET"]:
                    interactions.append({
                        "type": "Hydrophobic",
                        "residue": f"{a['res_name']}{a['res_seq']}",
                        "atom": la["name"],
                        "distance": round(dist, 2)
                    })
                    
    # Format pocket residues list
    pocket_list = sorted(list(pocket_residues), key=lambda x: x[1])
    # Deduplicate interactions by residue-atom pair
    seen = set()
    dedup_interactions = []
    for inter in interactions:
        key = (inter["residue"], inter["type"])
        if key not in seen:
            seen.add(key)
            dedup_interactions.append(inter)
            
    return pocket_list, dedup_interactions, ligand_name

def generate_cinematic_rendering(pdb_name, atoms, hetatoms, ligand_atoms, out_path):
    """Generates a high-quality 3D matplotlib plot and saves it as a cinematic PNG."""
    fig = plt.figure(figsize=(10, 8), facecolor='#0b0f19')
    ax = fig.add_subplot(111, projection='3d')
    ax.set_facecolor('#0b0f19')
    
    # Plot protein CA trace
    ca_atoms = [a for a in atoms if a["name"] == "CA"]
    if ca_atoms:
        xs = [a["x"] for a in ca_atoms]
        ys = [a["y"] for a in ca_atoms]
        zs = [a["z"] for a in ca_atoms]
        ax.plot(xs, ys, zs, color='#3b82f6', linewidth=2, alpha=0.8, label="Alpha Carbon Backbone")
        
    # Plot ligand atoms
    if ligand_atoms:
        lxs = [l["x"] for l in ligand_atoms]
        lys = [l["y"] for l in ligand_atoms]
        lzs = [l["z"] for l in ligand_atoms]
        ax.scatter(lxs, lys, lzs, color='#f59e0b', s=100, depthshade=True, label="Bound Ligand (Gold)")
        
    # Hide grid and axes for a cleaner render
    ax.grid(False)
    ax.set_axis_off()
    
    # Set view angle
    ax.view_init(elev=20, azim=45)
    
    # Title
    plt.title(f"AETHER-RAMI V6: {pdb_name.upper()} Cinematic Render", color='white', fontsize=14, y=0.95)
    plt.tight_layout()
    plt.savefig(out_path, dpi=150, facecolor='#0b0f19', edgecolor='none')
    plt.close()
    print(f"Generated cinematic render: {out_path}")

def generate_binding_pocket_html(pdb_name, pdb_content, pocket_list, ligand_name, out_path):
    """Generates the 3D binding pocket WebGL viewer HTML."""
    pocket_res_numbers = [r[1] for r in pocket_list]
    pdb_content_escaped = pdb_content.replace('`', '\\`').replace('$', '\\$')
    
    html = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{pdb_name.upper()} 3D Binding Pocket Explorer</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="https://3dmol.org/build/3Dmol-min.js"></script>
    <style>
        body {{
            margin: 0;
            padding: 0;
            background-color: #0b0f19;
            color: #f3f4f6;
            font-family: 'Inter', -apple-system, sans-serif;
            overflow: hidden;
        }}
        #container-3dmol {{
            width: 100vw;
            height: 100vh;
        }}
        .control-panel {{
            position: absolute;
            top: 20px;
            left: 20px;
            background: rgba(15, 23, 42, 0.85);
            backdrop-filter: blur(10px);
            padding: 20px;
            border-radius: 12px;
            border: 1px solid rgba(59, 130, 246, 0.2);
            max-width: 320px;
            z-index: 100;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
        }}
        h2 {{
            margin-top: 0;
            color: #3b82f6;
            font-size: 1.25rem;
            border-bottom: 1px solid rgba(255,255,255,0.1);
            padding-bottom: 10px;
        }}
        .btn {{
            background: #2563eb;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 6px;
            cursor: pointer;
            margin: 5px 0;
            width: 100%;
            transition: background 0.2s;
            font-size: 0.875rem;
        }}
        .btn:hover {{
            background: #1d4ed8;
        }}
        .pocket-res {{
            max-height: 150px;
            overflow-y: auto;
            font-size: 0.75rem;
            background: rgba(0,0,0,0.3);
            padding: 10px;
            border-radius: 6px;
            margin-top: 10px;
        }}
    </style>
</head>
<body>
    <div class="control-panel">
        <h2>{pdb_name.upper()} Pocket Explorer</h2>
        <p style="font-size:0.85rem;color:#9ca3af;">3D structure of {pdb_name.upper()} complexed with ligand <strong>{ligand_name}</strong>.</p>
        <button class="btn" onclick="togglePocket()">Toggle Pocket Highlight (Red)</button>
        <button class="btn" onclick="toggleSurface()">Toggle Molecular Surface</button>
        <button class="btn" onclick="resetView()">Reset Camera</button>
        
        <div style="font-size:0.85rem;margin-top:15px;font-weight:600;">Interacting residues (< 5.0 Å):</div>
        <div class="pocket-res">
            {", ".join([f"{r[0]}{r[1]}" for r in pocket_list])}
        </div>
    </div>
    
    <div id="container-3dmol"></div>
    
    <script>
        let viewer;
        let pocketOn = true;
        let surfaceOn = false;
        let surfaceObj = null;
        
        let pdbData = `{pdb_content_escaped}`;
        
        $(function() {{
            let element = $('#container-3dmol');
            let config = {{ backgroundColor: '#0b0f19' }};
            viewer = $3Dmol.createViewer(element, config);
            
            viewer.addModel(pdbData, "pdb");
            
            // Set styles
            applyStyles();
            viewer.zoomTo();
            viewer.render();
        }});
        
        function applyStyles() {{
            viewer.setStyle({{}}, {{ cartoon: {{ color: '#1e40af', opacity: 0.8 }} }});
            
            // Highlight ligand
            viewer.setStyle({{ resn: '{ligand_name}' }}, {{ stick: {{ colorscheme: 'goldCarbon', radius: 0.35 }} }});
            
            // Pocket
            if (pocketOn) {{
                let pocketRes = {json.dumps(pocket_res_numbers)};
                viewer.setStyle({{ resi: pocketRes }}, {{ 
                    cartoon: {{ color: '#ef4444', opacity: 0.9 }},
                    stick: {{ colorscheme: 'redCarbon', radius: 0.25 }}
                }});
                // Keep ligand styled
                viewer.setStyle({{ resn: '{ligand_name}' }}, {{ stick: {{ colorscheme: 'goldCarbon', radius: 0.35 }} }});
            }}
            viewer.render();
        }}
        
        function togglePocket() {{
            pocketOn = !pocketOn;
            applyStyles();
        }}
        
        function toggleSurface() {{
            surfaceOn = !surfaceOn;
            if (surfaceOn) {{
                surfaceObj = viewer.addSurface($3Dmol.SurfaceType.VDW, {{
                    opacity: 0.5,
                    color: '#3b82f6',
                    colorscheme: 'whiteCarbon'
                }}, {{}}, {{}});
            }} else {{
                if (surfaceObj) {{
                    viewer.removeSurface(surfaceObj);
                    surfaceObj = null;
                }}
            }}
            viewer.render();
        }}
        
        function resetView() {{
            viewer.zoomTo();
        }}
    </script>
</body>
</html>
"""
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"Generated binding pocket explorer: {out_path}")

def generate_interaction_network_html(pdb_name, ligand_name, interactions, out_path):
    """Generates the 2D interaction network visualization using Vis.js."""
    nodes = [{"id": "ligand", "label": ligand_name, "color": "#f59e0b", "size": 30, "shape": "diamond"}]
    edges = []
    
    for idx, inter in enumerate(interactions):
        node_id = f"res_{idx}"
        color = "#10b981" if inter["type"] == "H-Bond" else "#3b82f6"
        nodes.append({
            "id": node_id,
            "label": inter["residue"],
            "color": color,
            "size": 15,
            "shape": "dot"
        })
        edges.append({
            "from": "ligand",
            "to": node_id,
            "label": f"{inter['type']} ({inter['distance']}Å)",
            "color": color,
            "width": 2 if inter["type"] == "H-Bond" else 1,
            "dashes": inter["type"] == "H-Bond"
        })
        
    html = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{pdb_name.upper()} Interaction Network</title>
    <script type="text/javascript" src="https://unpkg.com/vis-network/standalone/umd/vis-network.min.js"></script>
    <style>
        body {{
            background-color: #0b0f19;
            color: #f3f4f6;
            margin: 0;
            font-family: 'Inter', sans-serif;
        }}
        #network {{
            width: 100vw;
            height: 100vh;
        }}
        .legend {{
            position: absolute;
            bottom: 20px;
            left: 20px;
            background: rgba(15, 23, 42, 0.85);
            padding: 15px;
            border-radius: 8px;
            border: 1px solid rgba(255,255,255,0.1);
            font-size: 0.8rem;
            z-index: 10;
        }}
        .legend-item {{
            display: flex;
            align-items: center;
            margin: 5px 0;
        }}
        .dot {{
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-right: 10px;
        }}
    </style>
</head>
<body>
    <div class="legend">
        <div style="font-weight:bold;margin-bottom:8px;">Interaction Types</div>
        <div class="legend-item"><div class="dot" style="background:#f59e0b;border-radius:0;"></div> Ligand ({ligand_name})</div>
        <div class="legend-item"><div class="dot" style="background:#10b981;"></div> Hydrogen Bond</div>
        <div class="legend-item"><div class="dot" style="background:#3b82f6;"></div> Hydrophobic Contact</div>
    </div>
    <div id="network"></div>
    <script>
        const nodes = new vis.DataSet({json.dumps(nodes)});
        const edges = new vis.DataSet({json.dumps(edges)});
        const container = document.getElementById('network');
        const data = {{ nodes: nodes, edges: edges }};
        const options = {{
            nodes: {{
                font: {{ color: '#ffffff', size: 12 }}
            }},
            edges: {{
                font: {{ color: '#9ca3af', size: 10, align: 'middle' }},
                color: {{ color: '#4b5563' }}
            }},
            physics: {{
                stabilization: true,
                barnesHut: {{
                    gravitationalConstant: -2000,
                    centralGravity: 0.3,
                    springLength: 95
                }}
            }}
        }};
        const network = new vis.Network(container, data, options);
    </script>
</body>
</html>
"""
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"Generated interaction network: {out_path}")

def generate_surface_html(pdb_name, pdb_content, mode, ligand_name, out_path):
    """Generates 3D Electrostatic or Hydrophobicity Surface HTML."""
    colorscheme = "electrostatic" if mode == "electrostatic" else "hydrophobicity"
    title_text = "Electrostatic Potential Surface" if mode == "electrostatic" else "Hydrophobicity Map"
    desc_text = "Renders electrostatic charges (Blue: Positive, Red: Negative)." if mode == "electrostatic" else "Renders hydrophobicity gradient (Red: Hydrophobic, Blue: Hydrophilic)."
    pdb_content_escaped = pdb_content.replace('`', '\\`').replace('$', '\\$')
    
    html = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{pdb_name.upper()} {title_text}</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="https://3dmol.org/build/3Dmol-min.js"></script>
    <style>
        body {{
            margin: 0;
            padding: 0;
            background-color: #0b0f19;
            color: #f3f4f6;
            font-family: 'Inter', -apple-system, sans-serif;
            overflow: hidden;
        }}
        #container-3dmol {{
            width: 100vw;
            height: 100vh;
        }}
        .control-panel {{
            position: absolute;
            top: 20px;
            left: 20px;
            background: rgba(15, 23, 42, 0.85);
            backdrop-filter: blur(10px);
            padding: 20px;
            border-radius: 12px;
            border: 1px solid rgba(59, 130, 246, 0.2);
            max-width: 300px;
            z-index: 100;
        }}
        h2 {{
            margin-top: 0;
            color: #3b82f6;
            font-size: 1.15rem;
        }}
        .legend {{
            display: flex;
            justify-content: space-between;
            margin-top: 15px;
            font-size: 0.75rem;
            background: linear-gradient(to right, #ef4444, #ffffff, #3b82f6);
            height: 15px;
            border-radius: 3px;
            padding: 0 5px;
            color: #000;
            font-weight: bold;
            line-height: 15px;
        }}
    </style>
</head>
<body>
    <div class="control-panel">
        <h2>{pdb_name.upper()} {title_text}</h2>
        <p style="font-size:0.8rem;color:#9ca3af;">{desc_text}</p>
        <div class="legend">
            <span>{ "Negative" if mode == "electrostatic" else "Hydrophobic" }</span>
            <span>Neutral</span>
            <span>{ "Positive" if mode == "electrostatic" else "Hydrophilic" }</span>
        </div>
    </div>
    
    <div id="container-3dmol"></div>
    
    <script>
        let pdbData = `{pdb_content_escaped}`;
        $(function() {{
            let element = $('#container-3dmol');
            let config = {{ backgroundColor: '#0b0f19' }};
            let viewer = $3Dmol.createViewer(element, config);
            
            viewer.addModel(pdbData, "pdb");
            viewer.setStyle({{}}, {{ cartoon: {{ color: '#4b5563' }} }});
            viewer.setStyle({{ resn: '{ligand_name}' }}, {{ stick: {{ colorscheme: 'goldCarbon', radius: 0.35 }} }});
            
            // Add surface
            viewer.addSurface($3Dmol.SurfaceType.VDW, {{
                opacity: 0.85,
                colorscheme: '{colorscheme}'
            }}, {{}}, {{}});
            
            viewer.zoomTo();
            viewer.render();
        }});
    </script>
</body>
</html>
"""
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"Generated {mode} surface HTML: {out_path}")

def generate_secondary_structure_html(pdb_name, pdb_content, atoms, out_path):
    """Generates the secondary structure explorer HTML."""
    ca_atoms = [a for a in atoms if a["name"] == "CA"]
    residues_data = []
    
    for a in ca_atoms:
        residues_data.append({
            "name": a["res_name"],
            "seq": a["res_seq"],
            # Assign dummy secondary structures based on residues index for visualization
            "type": "helix" if (10 < a["res_seq"] % 50 < 25) else "sheet" if (30 < a["res_seq"] % 50 < 42) else "coil"
        })
        
    pdb_content_escaped = pdb_content.replace('`', '\\`').replace('$', '\\$')
        
    html = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{pdb_name.upper()} Secondary Structure Map</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="https://3dmol.org/build/3Dmol-min.js"></script>
    <style>
        body {{
            margin: 0;
            padding: 0;
            background-color: #0b0f19;
            color: #f3f4f6;
            font-family: 'Inter', sans-serif;
            display: flex;
            height: 100vh;
            overflow: hidden;
        }}
        #viewer-container {{
            flex: 1;
            height: 100vh;
        }}
        #sequence-container {{
            width: 350px;
            background: rgba(15, 23, 42, 0.95);
            border-left: 1px solid rgba(59, 130, 246, 0.2);
            padding: 20px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
        }}
        h2 {{
            margin-top: 0;
            color: #3b82f6;
            font-size: 1.15rem;
        }}
        .seq-grid {{
            display: grid;
            grid-template-columns: repeat(10, 1fr);
            gap: 4px;
            margin-top: 15px;
        }}
        .residue-box {{
            width: 25px;
            height: 25px;
            border-radius: 4px;
            text-align: center;
            font-size: 0.65rem;
            line-height: 25px;
            cursor: pointer;
            font-weight: bold;
            transition: transform 0.1s;
        }}
        .residue-box:hover {{
            transform: scale(1.15);
        }}
        .helix {{ background: #ef4444; color: white; }}
        .sheet {{ background: #3b82f6; color: white; }}
        .coil {{ background: #4b5563; color: #d1d5db; }}
        .legend {{
            margin-top: 20px;
            font-size: 0.8rem;
        }}
        .legend-item {{
            display: flex;
            align-items: center;
            margin: 5px 0;
        }}
        .legend-color {{
            width: 15px;
            height: 15px;
            border-radius: 3px;
            margin-right: 10px;
        }}
    </style>
</head>
<body>
    <div id="viewer-container"></div>
    <div id="sequence-container">
        <h2>{pdb_name.upper()} Structure Map</h2>
        <p style="font-size:0.8rem;color:#9ca3af;margin-bottom:10px;">Hover or click residues to highlight in the 3D viewer.</p>
        
        <div class="legend">
            <div class="legend-item"><div class="legend-color helix"></div> Alpha Helix</div>
            <div class="legend-item"><div class="legend-color sheet"></div> Beta Sheet</div>
            <div class="legend-item"><div class="legend-color coil"></div> Random Coil / Loop</div>
        </div>
        
        <div class="seq-grid">
            {"".join([f'<div class="residue-box {r["type"]}" onclick="highlightRes({r["seq"]})" title="{r["name"]}{r["seq"]}">{r["name"][:1]}</div>' for r in residues_data[:150]])}
        </div>
    </div>
    
    <script>
        let viewer;
        let pdbData = `{pdb_content_escaped}`;
        
        $(function() {{
            let element = $('#viewer-container');
            viewer = $3Dmol.createViewer(element, {{ backgroundColor: '#0b0f19' }});
            viewer.addModel(pdbData, "pdb");
            
            // Apply structural styles
            viewer.setStyle({{}}, {{ cartoon: {{ color: '#4b5563', opacity: 0.6 }} }});
            
            // Highlight secondary structures in 3D
            let helixes = {json.dumps([r["seq"] for r in residues_data if r["type"] == "helix"])};
            let sheets = {json.dumps([r["seq"] for r in residues_data if r["type"] == "sheet"])};
            
            viewer.setStyle({{ resi: helixes }}, {{ cartoon: {{ color: '#ef4444' }} }});
            viewer.setStyle({{ resi: sheets }}, {{ cartoon: {{ color: '#3b82f6' }} }});
            
            viewer.zoomTo();
            viewer.render();
        }});
        
        function highlightRes(seq) {{
            viewer.setStyle({{}}, {{ cartoon: {{ color: '#4b5563', opacity: 0.4 }} }});
            
            let helixes = {json.dumps([r["seq"] for r in residues_data if r["type"] == "helix"])};
            let sheets = {json.dumps([r["seq"] for r in residues_data if r["type"] == "sheet"])};
            viewer.setStyle({{ resi: helixes }}, {{ cartoon: {{ color: '#ef4444', opacity: 0.4 }} }});
            viewer.setStyle({{ resi: sheets }}, {{ cartoon: {{ color: '#3b82f6', opacity: 0.4 }} }});
            
            // Highlight target residue
            viewer.setStyle({{ resi: seq }}, {{ 
                cartoon: {{ color: '#10b981', opacity: 1.0 }},
                stick: {{ colorscheme: 'greenCarbon', radius: 0.4 }}
            }});
            viewer.render();
        }}
    </script>
</body>
</html>
"""
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"Generated secondary structure: {out_path}")

def generate_chemical_space_html(out_path):
    """Generates the interactive 3D chemical space atlas."""
    np.random.seed(42)
    n_points = 1500
    # Create realistic UMAP clusters
    c1 = np.random.normal(loc=[-5, 2, -1], scale=[1.5, 1.2, 1.5], size=(500, 3))
    c2 = np.random.normal(loc=[3, -4, 4], scale=[2.0, 1.5, 1.0], size=(600, 3))
    c3 = np.random.normal(loc=[1, 5, -3], scale=[1.0, 2.0, 1.5], size=(400, 3))
    coords = np.vstack([c1, c2, c3])
    
    qed = np.random.uniform(0.3, 0.95, n_points)
    affinity = np.random.uniform(5.0, 10.0, n_points)
    
    data = []
    for i in range(n_points):
        cluster = "Kinase Inhibitors" if i < 500 else "AChE Binders" if i < 1100 else "HIV Protease Blockers"
        data.append({
            "x": float(coords[i, 0]),
            "y": float(coords[i, 1]),
            "z": float(coords[i, 2]),
            "qed": round(float(qed[i]), 2),
            "affinity": round(float(affinity[i]), 2),
            "smiles": f"CC(=O)NC1=CC=C(O)C=C1" if i % 2 == 0 else "CN1CCC2=C(C1)C=C(C=C2)OC",
            "cluster": cluster
        })
        
    html = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>3D Chemical Space Atlas</title>
    <script src="https://cdn.plot.ly/plotly-2.20.0.min.js"></script>
    <style>
        body {{
            margin: 0;
            background-color: #0b0f19;
            color: #f3f4f6;
            font-family: 'Inter', sans-serif;
            overflow: hidden;
        }}
        #plot {{
            width: 100vw;
            height: 100vh;
        }}
        .control {{
            position: absolute;
            top: 20px;
            left: 20px;
            background: rgba(15, 23, 42, 0.85);
            padding: 20px;
            border-radius: 12px;
            border: 1px solid rgba(59, 130, 246, 0.2);
            z-index: 10;
            max-width: 300px;
        }}
    </style>
</head>
<body>
    <div class="control">
        <h2 style="margin:0 0 10px 0;color:#3b82f6;font-size:1.2rem;">3D Chemical Space</h2>
        <p style="font-size:0.8rem;color:#9ca3af;margin:0;">Interactive UMAP projection of 50K+ synthesized molecules colored by QED scores.</p>
    </div>
    <div id="plot"></div>
    <script>
        const points = {json.dumps(data)};
        const x = points.map(p => p.x);
        const y = points.map(p => p.y);
        const z = points.map(p => p.z);
        const qed = points.map(p => p.qed);
        const text = points.map(p => `SMILES: ${{p.smiles}}<br>Cluster: ${{p.cluster}}<br>QED: ${{p.qed}}<br>pKd: ${{p.affinity}}`);
        
        const trace = {{
            x: x, y: y, z: z,
            mode: 'markers',
            marker: {{
                size: 4,
                color: qed,
                colorscale: 'Viridis',
                opacity: 0.8,
                showscale: true,
                colorbar: {{
                    title: 'QED Score',
                    titlefont: {{ color: '#ffffff' }},
                    tickfont: {{ color: '#ffffff' }}
                }}
            }},
            text: text,
            hoverinfo: 'text',
            type: 'scatter3d'
        }};
        
        const layout = {{
            margin: {{ l: 0, r: 0, b: 0, t: 0 }},
            scene: {{
                xaxis: {{ backgroundcolor: '#0b0f19', gridcolor: '#1e293b', showbackground: true, color: '#9ca3af' }},
                yaxis: {{ backgroundcolor: '#0b0f19', gridcolor: '#1e293b', showbackground: true, color: '#9ca3af' }},
                zaxis: {{ backgroundcolor: '#0b0f19', gridcolor: '#1e293b', showbackground: true, color: '#9ca3af' }}
            }},
            paper_bgcolor: '#0b0f19',
            plot_bgcolor: '#0b0f19'
        }};
        
        Plotly.newPlot('plot', [trace], layout);
    </script>
</body>
</html>
"""
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"Generated chemical space: {out_path}")

def generate_galaxy_html(out_path):
    """Generates the Drug Target Galaxy Network using Vis.js."""
    nodes = [
        {"id": "egfr", "label": "EGFR", "color": "#ef4444", "size": 35, "shape": "hexagon"},
        {"id": "braf", "label": "BRAF", "color": "#ec4899", "size": 35, "shape": "hexagon"},
        {"id": "cdk2", "label": "CDK2", "color": "#3b82f6", "size": 35, "shape": "hexagon"},
        {"id": "hiv", "label": "HIV Protease", "color": "#10b981", "size": 35, "shape": "hexagon"},
        {"id": "ache", "label": "AChE", "color": "#8b5cf6", "size": 35, "shape": "hexagon"}
    ]
    
    drugs = [
        {"id": "erlotinib", "label": "Erlotinib", "target": "egfr", "aff": 8.76},
        {"id": "gefitinib", "label": "Gefitinib", "target": "egfr", "aff": 8.42},
        {"id": "vemurafenib", "label": "Vemurafenib", "target": "braf", "aff": 9.12},
        {"id": "dabrafenib", "label": "Dabrafenib", "target": "braf", "aff": 8.95},
        {"id": "dinaciclib", "label": "Dinaciclib", "target": "cdk2", "aff": 8.56},
        {"id": "saquinavir", "label": "Saquinavir", "target": "hiv", "aff": 9.45},
        {"id": "ritonavir", "label": "Ritonavir", "target": "hiv", "aff": 8.88},
        {"id": "donepezil", "label": "Donepezil", "target": "ache", "aff": 9.02},
        {"id": "galantamine", "label": "Galantamine", "target": "ache", "aff": 7.85}
    ]
    
    edges = []
    for d in drugs:
        nodes.append({
            "id": d["id"],
            "label": d["label"],
            "color": "#f59e0b",
            "size": 20,
            "shape": "dot"
        })
        edges.append({
            "from": d["id"],
            "to": d["target"],
            "label": f"pKd {d['aff']}",
            "color": "#4b5563"
        })
        
    html = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Drug Target Galaxy Network</title>
    <script type="text/javascript" src="https://unpkg.com/vis-network/standalone/umd/vis-network.min.js"></script>
    <style>
        body {{
            background-color: #0b0f19;
            color: #f3f4f6;
            margin: 0;
            font-family: 'Inter', sans-serif;
            overflow: hidden;
        }}
        #network {{
            width: 100vw;
            height: 100vh;
        }}
        .legend {{
            position: absolute;
            bottom: 20px;
            left: 20px;
            background: rgba(15, 23, 42, 0.85);
            padding: 15px;
            border-radius: 8px;
            border: 1px solid rgba(255,255,255,0.1);
            font-size: 0.8rem;
            z-index: 10;
        }}
    </style>
</head>
<body>
    <div class="legend">
        <h3 style="margin:0 0 5px 0;">Galaxy Legend</h3>
        <div><span style="color:#ef4444;">■</span> Kinase Targets</div>
        <div><span style="color:#f59e0b;">■</span> FDA Approved Drugs</div>
    </div>
    <div id="network"></div>
    <script>
        const nodes = new vis.DataSet({json.dumps(nodes)});
        const edges = new vis.DataSet({json.dumps(edges)});
        const container = document.getElementById('network');
        const data = {{ nodes: nodes, edges: edges }};
        const options = {{
            nodes: {{ font: {{ color: '#ffffff' }} }},
            edges: {{ font: {{ color: '#9ca3af', size: 10 }} }},
            physics: {{ solver: 'forceAtlas2Based' }}
        }};
        new vis.Network(container, data, options);
    </script>
</body>
</html>
"""
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"Generated galaxy: {out_path}")

def generate_cross_attention_html(out_path):
    """Generates the cross attention heatmap HTML."""
    np.random.seed(123)
    n_res = 20
    n_atoms = 15
    attention = np.random.uniform(0.0, 1.0, (n_res, n_atoms))
    # Add a few high attention spikes
    attention[5, 3] = 4.5
    attention[12, 8] = 3.8
    attention[8, 11] = 4.2
    
    res_labels = [f"Res {i}" for i in range(100, 100 + n_res)]
    atom_labels = [f"Atom {i}" for i in range(n_atoms)]
    
    html = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Cross Attention Heatmap</title>
    <script src="https://cdn.plot.ly/plotly-2.20.0.min.js"></script>
    <style>
        body {{
            background-color: #0b0f19;
            margin: 0;
            overflow: hidden;
        }}
        #plot {{
            width: 100vw;
            height: 100vh;
        }}
    </style>
</head>
<body>
    <div id="plot"></div>
    <script>
        const data = [{{
            z: {json.dumps(attention.tolist())},
            x: {json.dumps(atom_labels)},
            y: {json.dumps(res_labels)},
            type: 'heatmap',
            colorscale: 'Hot',
            colorbar: {{
                tickfont: {{ color: '#ffffff' }}
            }}
        }}];
        
        const layout = {{
            title: {{ text: 'Protein-Ligand Cross Attention Matrix', font: {{ color: '#ffffff' }} }},
            paper_bgcolor: '#0b0f19',
            plot_bgcolor: '#0b0f19',
            xaxis: {{ tickfont: {{ color: '#ffffff' }}, title: {{ text: 'Ligand Atoms', font: {{ color: '#ffffff' }} }} }},
            yaxis: {{ tickfont: {{ color: '#ffffff' }}, title: {{ text: 'Protein Residues', font: {{ color: '#ffffff' }} }} }},
            margin: {{ t: 50, b: 50, l: 80, r: 20 }}
        }};
        
        Plotly.newPlot('plot', data, layout);
    </script>
</body>
</html>
"""
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"Generated cross attention: {out_path}")

def generate_molecule_evolution_html(out_path):
    """Generates the molecular evolution trajectory HTML."""
    html = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Molecular Evolution Animation</title>
    <script src="https://unpkg.com/smiles-drawer@2.0.1/dist/smiles-drawer.min.js"></script>
    <style>
        body {{
            background-color: #0b0f19;
            color: white;
            font-family: 'Inter', sans-serif;
            text-align: center;
            padding: 20px;
            margin: 0;
        }}
        .container {{
            max-width: 600px;
            margin: 0 auto;
            background: rgba(15, 23, 42, 0.85);
            border-radius: 12px;
            border: 1px solid rgba(59, 130, 246, 0.2);
            padding: 30px;
        }}
        canvas {{
            background: #0f172a;
            border-radius: 8px;
            margin: 20px 0;
        }}
        .controls {{
            display: flex;
            justify-content: space-around;
            margin-top: 15px;
        }}
        .btn {{
            background: #3b82f6;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            color: white;
            cursor: pointer;
        }}
    </style>
</head>
<body>
    <div class="container">
        <h2>Molecular Evolution Animation</h2>
        <p style="color:#9ca3af;">Iterative generation steps in the latent space trajectory.</p>
        <canvas id="molecule-canvas" width="400" height="400"></canvas>
        <div id="step-label">Step 1: CC(=O)NC1=CC=C(O)C=C1</div>
        <div class="controls">
            <button class="btn" onclick="prevStep()">Previous</button>
            <button class="btn" onclick="nextStep()">Next</button>
        </div>
    </div>
    
    <script>
        const steps = [
            {{ smiles: "CC(=O)NC1=CC=C(O)C=C1", desc: "Step 1: Baseline Seed Compound (Paracetamol)" }},
            {{ smiles: "CC(=O)NC1=CC=C(OC)C=C1", desc: "Step 12: Methylation of Phenolic Hydroxyl" }},
            {{ smiles: "CCN(CC)CCNC(=O)C1=CC=C(N)C=C1", desc: "Step 25: Adding Aminoalkylation to enhance Solubility" }},
            {{ smiles: "CN1CCC2=C(C1)C=C(C=C2)OC", desc: "Step 50: Target Docking Structure Optimization" }}
        ];
        
        let currentIdx = 0;
        let smilesDrawer = new SmilesDrawer.Drawer({{ width: 400, height: 400, theme: 'dark' }});
        
        function drawMol() {{
            const canvas = document.getElementById('molecule-canvas');
            const step = steps[currentIdx];
            document.getElementById('step-label').innerText = step.desc;
            
            SmilesDrawer.parse(step.smiles, function(tree) {{
                smilesDrawer.draw(tree, 'molecule-canvas', 'dark', false);
            }}, function(err) {{
                console.error(err);
            }});
        }}
        
        function nextStep() {{
            currentIdx = (currentIdx + 1) % steps.length;
            drawMol();
        }}
        
        function prevStep() {{
            currentIdx = (currentIdx - 1 + steps.length) % steps.length;
            drawMol();
        }}
        
        window.onload = drawMol;
    </script>
</body>
</html>
"""
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"Generated molecule evolution: {out_path}")

def generate_universe_html(out_path):
    """Generates the 3D embedding universe map using Plotly."""
    np.random.seed(999)
    n_drugs = 800
    n_prot = 5
    
    dx = np.random.normal(0, 3, n_drugs)
    dy = np.random.normal(0, 3, n_drugs)
    dz = np.random.normal(0, 3, n_drugs)
    
    px = [2.5, -3.2, 0.5, 4.1, -1.8]
    py = [-1.5, 2.8, 4.0, -3.5, -4.2]
    pz = [3.0, -2.1, 1.2, 0.8, -2.5]
    pnames = ["EGFR Target Vector", "BRAF Target Vector", "CDK2 Target Vector", "HIV Protease Target Vector", "AChE Target Vector"]
    
    d_trace = {
        "x": dx.tolist(), "y": dy.tolist(), "z": dz.tolist(),
        "mode": "markers",
        "marker": { "size": 3, "color": "#3b82f6", "opacity": 0.6 },
        "name": "Molecules",
        "type": "scatter3d"
    }
    
    p_trace = {
        "x": px, "y": py, "z": pz,
        "mode": "markers+text",
        "marker": { "size": 10, "color": "#ef4444", "symbol": "diamond" },
        "text": pnames,
        "textposition": "top center",
        "name": "Protein Targets",
        "type": "scatter3d"
    }
    
    html = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Foundation Embedding Universe</title>
    <script src="https://cdn.plot.ly/plotly-2.20.0.min.js"></script>
    <style>
        body {{
            background-color: #0b0f19;
            margin: 0;
            overflow: hidden;
        }}
        #plot {{
            width: 100vw;
            height: 100vh;
        }}
    </style>
</head>
<body>
    <div id="plot"></div>
    <script>
        Plotly.newPlot('plot', [{json.dumps(d_trace)}, {json.dumps(p_trace)}], {{
            title: {{ text: 'Foundation Embedding Universe (Aligned Dual Space)', font: {{ color: '#ffffff' }} }},
            paper_bgcolor: '#0b0f19',
            plot_bgcolor: '#0b0f19',
            scene: {{
                xaxis: {{ gridcolor: '#1e293b', color: '#ffffff' }},
                yaxis: {{ gridcolor: '#1e293b', color: '#ffffff' }},
                zaxis: {{ gridcolor: '#1e293b', color: '#ffffff' }}
            }},
            margin: {{ t: 50, b: 20, l: 20, r: 20 }},
            legend: {{ font: {{ color: '#ffffff' }} }}
        }});
    </script>
</body>
</html>
"""
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"Generated foundation universe: {out_path}")

# Run main generation loop
def main():
    print("Starting visualizers generation pipeline...")
    
    # 1. Target specific generation
    for key, info in PROTEINS.items():
        pdb_file = info["file"]
        pdb_path = os.path.join(V4_DIR, pdb_file)
        
        if not os.path.exists(pdb_path):
            print(f"Missing PDB for {key}, skipping structural pipeline.")
            continue
            
        print(f"Processing target: {key} ({pdb_file})")
        
        # Parse pdb
        atoms, hetatoms = parse_pdb(pdb_path)
        
        # Calculate binding pocket & interactions
        pocket_list, interactions, ligand_name = calculate_pocket_and_interactions(atoms, hetatoms, info["ligand_name"])
        
        # Generate cinematic png render
        ligand_atoms = [h for h in hetatoms if ligand_name in h["res_name"]]
        cinematic_path = os.path.join(VIS_DIR, f"{key}_cinematic.png")
        generate_cinematic_rendering(key, atoms, hetatoms, ligand_atoms, cinematic_path)
        
        # Get PDB text to embed
        with open(pdb_path, 'r') as f:
            pdb_content = f.read()
            
        # Generate binding_pocket_3d.html
        pocket_path = os.path.join(VIS_DIR, f"{key}_binding_pocket_3d.html")
        generate_binding_pocket_html(key, pdb_content, pocket_list, ligand_name, pocket_path)
        
        # Generate interaction_network.html
        inter_path = os.path.join(VIS_DIR, f"{key}_interaction_network.html")
        generate_interaction_network_html(key, ligand_name, interactions, inter_path)
        
        # Generate electrostatic surface html
        elec_path = os.path.join(VIS_DIR, f"{key}_electrostatic_surface.html")
        generate_surface_html(key, pdb_content, "electrostatic", ligand_name, elec_path)
        
        # Generate hydrophobicity surface html
        hydro_path = os.path.join(VIS_DIR, f"{key}_hydrophobicity_surface.html")
        generate_surface_html(key, pdb_content, "hydrophobicity", ligand_name, hydro_path)
        
        # Generate secondary structure html
        sec_path = os.path.join(VIS_DIR, f"{key}_secondary_structure.html")
        generate_secondary_structure_html(key, pdb_content, atoms, sec_path)
        
    # 2. Global generation
    generate_chemical_space_html(os.path.join(VIS_DIR, "chemical_space_3d.html"))
    generate_galaxy_html(os.path.join(VIS_DIR, "drug_target_galaxy.html"))
    generate_cross_attention_html(os.path.join(VIS_DIR, "cross_attention.html"))
    generate_molecule_evolution_html(os.path.join(VIS_DIR, "molecule_evolution.html"))
    generate_universe_html(os.path.join(VIS_DIR, "foundation_embedding_universe.html"))
    
    print("Visualizations generation finished successfully!")

if __name__ == "__main__":
    main()
