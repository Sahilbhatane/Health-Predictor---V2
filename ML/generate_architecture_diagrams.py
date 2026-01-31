"""
Health Predictor V2 - Architecture & System Diagrams Generator
This script generates comprehensive architecture visualizations for the Health Predictor system.
"""

import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch, Rectangle
import numpy as np
from pathlib import Path
import os

# Create output directory
output_dir = Path('./graphs')
output_dir.mkdir(exist_ok=True)

print("🎨 Generating Architecture Diagrams for Health Predictor V2...\n")


def create_system_architecture():
    """Create comprehensive system architecture diagram"""
    fig, ax = plt.subplots(figsize=(18, 14))
    ax.set_xlim(0, 18)
    ax.set_ylim(0, 14)
    ax.axis('off')
    ax.set_facecolor('#f8f9fa')

    # Title
    ax.text(9, 13.5, '🏥 Health Predictor V2 - System Architecture', 
            fontsize=20, fontweight='bold', ha='center', va='center',
            bbox=dict(boxstyle='round,pad=0.5', facecolor='#2c3e50', edgecolor='none'),
            color='white')

    # === Frontend Layer ===
    frontend_box = FancyBboxPatch((0.5, 10), 5, 2.5, boxstyle="round,pad=0.1", 
                                   facecolor='#3498db', edgecolor='#2980b9', linewidth=2)
    ax.add_patch(frontend_box)
    ax.text(3, 11.8, '🖥️ FRONTEND', fontsize=14, fontweight='bold', ha='center', color='white')
    ax.text(3, 11.2, 'Next.js + React', fontsize=10, ha='center', color='white')
    ax.text(3, 10.7, 'TypeScript • TailwindCSS', fontsize=9, ha='center', color='#ecf0f1')
    ax.text(3, 10.3, 'User Authentication (NextAuth)', fontsize=8, ha='center', color='#ecf0f1')

    # === API Layer ===
    api_box = FancyBboxPatch((6.5, 10), 5, 2.5, boxstyle="round,pad=0.1", 
                              facecolor='#2ecc71', edgecolor='#27ae60', linewidth=2)
    ax.add_patch(api_box)
    ax.text(9, 11.8, '⚡ API SERVER', fontsize=14, fontweight='bold', ha='center', color='white')
    ax.text(9, 11.2, 'Python Flask', fontsize=10, ha='center', color='white')
    ax.text(9, 10.7, 'REST API Endpoints', fontsize=9, ha='center', color='#ecf0f1')
    ax.text(9, 10.3, 'Model Serving & Inference', fontsize=8, ha='center', color='#ecf0f1')

    # === ML Models Layer ===
    ml_box = FancyBboxPatch((12.5, 10), 5, 2.5, boxstyle="round,pad=0.1", 
                             facecolor='#9b59b6', edgecolor='#8e44ad', linewidth=2)
    ax.add_patch(ml_box)
    ax.text(15, 11.8, '🤖 ML MODELS', fontsize=14, fontweight='bold', ha='center', color='white')
    ax.text(15, 11.2, 'Scikit-learn • TensorFlow', fontsize=10, ha='center', color='white')
    ax.text(15, 10.7, 'SVM • Logistic Regression • MLP', fontsize=9, ha='center', color='#ecf0f1')
    ax.text(15, 10.3, 'Model Serialization (Pickle/Joblib)', fontsize=8, ha='center', color='#ecf0f1')

    # === Individual Disease Models ===
    models_data = [
        {'name': '🩺 Diabetes\nPrediction', 'algo': 'SVM (Linear)', 'color': '#e74c3c', 'x': 1.5, 'acc': '78%'},
        {'name': '❤️ Heart Disease\nPrediction', 'algo': 'LR + SVM', 'color': '#e67e22', 'x': 5.5, 'acc': '85%'},
        {'name': "🧠 Parkinson's\nPrediction", 'algo': 'SVM (Linear)', 'color': '#1abc9c', 'x': 9.5, 'acc': '87%'},
        {'name': '🏥 Common Diseases\nPrediction', 'algo': 'LR + MLP', 'color': '#3498db', 'x': 13.5, 'acc': '97%'}
    ]

    for m in models_data:
        model_box = FancyBboxPatch((m['x'], 5.5), 3, 3.5, boxstyle="round,pad=0.1", 
                                    facecolor=m['color'], edgecolor='#2c3e50', linewidth=1.5)
        ax.add_patch(model_box)
        ax.text(m['x']+1.5, 8.2, m['name'], fontsize=10, fontweight='bold', ha='center', va='center', color='white')
        ax.text(m['x']+1.5, 6.8, m['algo'], fontsize=9, ha='center', color='white')
        ax.text(m['x']+1.5, 6.2, '━━━━━━━━', fontsize=8, ha='center', color='#ecf0f1')
        ax.text(m['x']+1.5, 5.9, f'Accuracy: {m["acc"]}', fontsize=9, ha='center', color='white', fontweight='bold')

    # === Data Layer ===
    data_box = FancyBboxPatch((4, 1.5), 10, 2.5, boxstyle="round,pad=0.1", 
                               facecolor='#34495e', edgecolor='#2c3e50', linewidth=2)
    ax.add_patch(data_box)
    ax.text(9, 3.2, '📊 DATA LAYER', fontsize=14, fontweight='bold', ha='center', color='white')
    ax.text(9, 2.5, 'diabetes.csv  •  heart.csv  •  parkinsons.csv  •  final_common.csv', 
            fontsize=10, ha='center', color='#ecf0f1')
    ax.text(9, 1.9, 'Feature Engineering • Data Preprocessing • Label Encoding', 
            fontsize=9, ha='center', color='#bdc3c7')

    # === Arrows ===
    arrow_style = dict(arrowstyle='->', color='#7f8c8d', lw=2, mutation_scale=15)
    # Frontend to API
    ax.annotate('', xy=(6.5, 11.25), xytext=(5.5, 11.25), arrowprops=arrow_style)
    # API to ML
    ax.annotate('', xy=(12.5, 11.25), xytext=(11.5, 11.25), arrowprops=arrow_style)
    # ML to Models
    for m in models_data:
        ax.annotate('', xy=(m['x']+1.5, 9), xytext=(m['x']+1.5, 9.8), arrowprops=arrow_style)
    # Models to Data
    for m in models_data:
        ax.annotate('', xy=(m['x']+1.5, 4), xytext=(m['x']+1.5, 5.3), arrowprops=arrow_style)

    # Legend
    legend_items = [
        mpatches.Patch(color='#3498db', label='Frontend (Next.js)'),
        mpatches.Patch(color='#2ecc71', label='API Server (Flask)'),
        mpatches.Patch(color='#9b59b6', label='ML Framework'),
        mpatches.Patch(color='#34495e', label='Data Storage'),
    ]
    ax.legend(handles=legend_items, loc='lower right', fontsize=10, framealpha=0.9)

    plt.tight_layout()
    filepath = output_dir / 'system_architecture.png'
    plt.savefig(filepath, dpi=300, bbox_inches='tight', facecolor='#f8f9fa')
    plt.close()
    print(f"✅ System Architecture: {filepath}")


def create_ml_pipeline_flow():
    """Create ML pipeline flow diagram"""
    fig, ax = plt.subplots(figsize=(16, 10))
    ax.set_xlim(0, 16)
    ax.set_ylim(0, 10)
    ax.axis('off')
    ax.set_facecolor('#ffffff')

    # Title
    ax.text(8, 9.5, '📊 ML Pipeline Flow - Health Predictor', fontsize=18, fontweight='bold', 
            ha='center', bbox=dict(boxstyle='round,pad=0.5', facecolor='#2c3e50', edgecolor='none'), 
            color='white')

    # Pipeline Steps
    steps = [
        {'x': 1, 'y': 6, 'title': '1. Data\nCollection', 'desc': 'CSV Files\nPatient Records', 'color': '#3498db'},
        {'x': 4, 'y': 6, 'title': '2. Data\nPreprocessing', 'desc': 'Cleaning\nNormalization', 'color': '#2ecc71'},
        {'x': 7, 'y': 6, 'title': '3. Feature\nEngineering', 'desc': 'Selection\nEncoding', 'color': '#f39c12'},
        {'x': 10, 'y': 6, 'title': '4. Model\nTraining', 'desc': 'SVM/LR/NN\nCross-Validation', 'color': '#9b59b6'},
        {'x': 13, 'y': 6, 'title': '5. Model\nEvaluation', 'desc': 'Accuracy\nROC-AUC', 'color': '#e74c3c'},
    ]

    for step in steps:
        box = FancyBboxPatch((step['x']-0.8, step['y']-1.2), 2.4, 2.4, 
                              boxstyle="round,pad=0.1", facecolor=step['color'], 
                              edgecolor='#2c3e50', linewidth=2)
        ax.add_patch(box)
        ax.text(step['x']+0.4, step['y']+0.7, step['title'], fontsize=11, fontweight='bold', 
                ha='center', va='center', color='white')
        ax.text(step['x']+0.4, step['y']-0.3, step['desc'], fontsize=9, 
                ha='center', va='center', color='#ecf0f1')

    # Arrows between steps
    for i in range(len(steps)-1):
        ax.annotate('', xy=(steps[i+1]['x']-0.9, steps[i+1]['y']), 
                    xytext=(steps[i]['x']+1.7, steps[i]['y']),
                    arrowprops=dict(arrowstyle='->', color='#7f8c8d', lw=3, mutation_scale=20))

    # Deployment section
    ax.add_patch(FancyBboxPatch((5.5, 1.5), 5, 2, boxstyle="round,pad=0.1", 
                                 facecolor='#1abc9c', edgecolor='#16a085', linewidth=2))
    ax.text(8, 2.8, '6. Deployment & Serving', fontsize=12, fontweight='bold', ha='center', color='white')
    ax.text(8, 2.0, 'Flask API • Model Serialization • Real-time Predictions', fontsize=10, ha='center', color='#ecf0f1')

    # Arrow from evaluation to deployment
    ax.annotate('', xy=(8, 3.5), xytext=(8, 4.7),
                arrowprops=dict(arrowstyle='->', color='#7f8c8d', lw=3, mutation_scale=20))

    plt.tight_layout()
    filepath = output_dir / 'ml_pipeline_flow.png'
    plt.savefig(filepath, dpi=300, bbox_inches='tight', facecolor='white')
    plt.close()
    print(f"✅ ML Pipeline Flow: {filepath}")


def create_data_flow_diagram():
    """Create data flow between components"""
    fig, ax = plt.subplots(figsize=(14, 10))
    ax.set_xlim(0, 14)
    ax.set_ylim(0, 10)
    ax.axis('off')
    ax.set_facecolor('#f5f6fa')

    # Title
    ax.text(7, 9.5, '🔄 Data Flow Architecture - Health Predictor', fontsize=18, fontweight='bold', 
            ha='center', bbox=dict(boxstyle='round,pad=0.5', facecolor='#2c3e50', edgecolor='none'), 
            color='white')

    # Components
    components = [
        {'name': 'Patient\nInput', 'x': 1, 'y': 7, 'color': '#e74c3c', 'icon': '👤'},
        {'name': 'Data\nValidation', 'x': 3.5, 'y': 7, 'color': '#3498db', 'icon': '✓'},
        {'name': 'Feature\nExtraction', 'x': 6, 'y': 7, 'color': '#f39c12', 'icon': '⚙️'},
        {'name': 'ML Model\nPrediction', 'x': 8.5, 'y': 7, 'color': '#9b59b6', 'icon': '🤖'},
        {'name': 'Result\nDisplay', 'x': 11, 'y': 7, 'color': '#2ecc71', 'icon': '📊'},
    ]

    for comp in components:
        box = FancyBboxPatch((comp['x']-0.7, comp['y']-1), 1.4, 2, 
                              boxstyle="round,pad=0.05", facecolor=comp['color'], 
                              edgecolor='#2c3e50', linewidth=1.5)
        ax.add_patch(box)
        ax.text(comp['x'], comp['y']+0.5, comp['icon'], fontsize=20, ha='center', va='center')
        ax.text(comp['x'], comp['y']-0.3, comp['name'], fontsize=9, fontweight='bold', 
                ha='center', va='center', color='white')

    # Data flow arrows
    for i in range(len(components)-1):
        ax.annotate('', xy=(components[i+1]['x']-0.7, components[i+1]['y']), 
                    xytext=(components[i]['x']+0.7, components[i]['y']),
                    arrowprops=dict(arrowstyle='->', color='#34495e', lw=3, mutation_scale=20))

    # Database section
    db_box = FancyBboxPatch((2, 3.5), 10, 1.8, boxstyle="round,pad=0.1", 
                             facecolor='#34495e', edgecolor='#2c3e50', linewidth=2, linestyle='--')
    ax.add_patch(db_box)
    ax.text(7, 4.8, '💾 Database Layer', fontsize=12, fontweight='bold', ha='center', color='white')
    ax.text(7, 4.1, 'Patient Data • Medical History • Predictions • Audit Logs', fontsize=9, ha='center', color='#ecf0f1')

    # Feedback loops
    ax.annotate('', xy=(3.5, 5.5), xytext=(3.5, 6),
                arrowprops=dict(arrowstyle='<->', color='#e74c3c', lw=2, linestyle='--', mutation_scale=15))
    ax.annotate('', xy=(8.5, 5.5), xytext=(8.5, 6),
                arrowprops=dict(arrowstyle='<->', color='#e74c3c', lw=2, linestyle='--', mutation_scale=15))

    # Model variants section
    ax.text(7, 2.8, '🏥 Available Disease Prediction Models', fontsize=11, fontweight='bold', ha='center')
    
    models_info = [
        {'name': 'Diabetes', 'algo': 'SVM', 'x': 2},
        {'name': 'Heart', 'algo': 'LR+SVM', 'x': 5},
        {'name': "Parkinson's", 'algo': 'SVM', 'x': 8},
        {'name': 'Common', 'algo': 'LR+MLP', 'x': 11},
    ]
    
    for model in models_info:
        ax.text(model['x'], 2.1, f"{model['name']}\n{model['algo']}", fontsize=8, ha='center',
                bbox=dict(boxstyle='round,pad=0.3', facecolor='#ecf0f1', edgecolor='#34495e', linewidth=1))

    # Performance metrics section
    ax.text(7, 0.8, '📈 Expected Performance: 78-97% Accuracy | Real-time Inference | Multi-disease Support', 
            fontsize=9, ha='center', style='italic', color='#7f8c8d')

    plt.tight_layout()
    filepath = output_dir / 'data_flow_diagram.png'
    plt.savefig(filepath, dpi=300, bbox_inches='tight', facecolor='#f5f6fa')
    plt.close()
    print(f"✅ Data Flow Diagram: {filepath}")


def create_project_structure():
    """Create project directory structure visualization"""
    fig, ax = plt.subplots(figsize=(14, 10))
    ax.set_xlim(0, 14)
    ax.set_ylim(0, 10)
    ax.axis('off')
    ax.set_facecolor('#ffffff')

    # Title
    ax.text(7, 9.5, '📁 Project Directory Structure - Health Predictor V2', fontsize=16, fontweight='bold', 
            ha='center', bbox=dict(boxstyle='round,pad=0.4', facecolor='#2c3e50', edgecolor='none'), 
            color='white')

    # Tree structure
    y_pos = 9
    tree_lines = [
        ('Health-Predictor-V2/', 0.5, '#2c3e50', True),
        ('├── frontend/', 1, '#3498db', False),
        ('│   ├── app/', 1.5, '#3498db', False),
        ('│   ├── components/', 1.5, '#3498db', False),
        ('│   ├── hooks/', 1.5, '#3498db', False),
        ('│   └── package.json', 1.5, '#3498db', False),
        ('├── server/', 1, '#2ecc71', False),
        ('│   ├── app.py', 1.5, '#2ecc71', False),
        ('│   ├── models/', 1.5, '#2ecc71', False),
        ('│   └── requirements.txt', 1.5, '#2ecc71', False),
        ('├── ML/', 1, '#9b59b6', False),
        ('│   ├── Diabetes.ipynb', 1.5, '#9b59b6', False),
        ('│   ├── Heart.ipynb', 1.5, '#9b59b6', False),
        ('│   ├── Parkinson\'s.ipynb', 1.5, '#9b59b6', False),
        ('│   ├── Common.ipynb', 1.5, '#9b59b6', False),
        ('│   └── graphs/', 1.5, '#9b59b6', False),
        ('├── Datasets/', 1, '#e74c3c', False),
        ('│   ├── data/', 1.5, '#e74c3c', False),
        ('│   └── pkl/', 1.5, '#e74c3c', False),
        ('├── api/', 1, '#f39c12', False),
        ('├── README.md', 1, '#34495e', False),
        ('└── LICENSE', 1, '#34495e', False),
    ]

    y_pos = 8.8
    for line, indent, color, is_root in tree_lines:
        if is_root:
            ax.text(0.5 + indent, y_pos, line, fontsize=11, fontweight='bold', 
                   bbox=dict(boxstyle='round,pad=0.3', facecolor=color, edgecolor='none'),
                   color='white', family='monospace')
        else:
            ax.text(0.5 + indent, y_pos, line, fontsize=9, color=color, family='monospace', fontweight='bold')
        y_pos -= 0.3

    # Legend
    legend_y = 1.2
    ax.text(1, legend_y, '🖥️ Frontend: Next.js React App', fontsize=9, 
           bbox=dict(boxstyle='round,pad=0.2', facecolor='#3498db', alpha=0.2))
    ax.text(5, legend_y, '⚡ Server: Flask API Backend', fontsize=9, 
           bbox=dict(boxstyle='round,pad=0.2', facecolor='#2ecc71', alpha=0.2))
    ax.text(9.5, legend_y, '🤖 ML: Jupyter Notebooks & Models', fontsize=9, 
           bbox=dict(boxstyle='round,pad=0.2', facecolor='#9b59b6', alpha=0.2))
    
    ax.text(1, 0.6, '📊 Data: CSV Files & Datasets', fontsize=9, 
           bbox=dict(boxstyle='round,pad=0.2', facecolor='#e74c3c', alpha=0.2))
    ax.text(5, 0.6, '📁 API: Backend Routes & Controllers', fontsize=9, 
           bbox=dict(boxstyle='round,pad=0.2', facecolor='#f39c12', alpha=0.2))

    plt.tight_layout()
    filepath = output_dir / 'project_structure.png'
    plt.savefig(filepath, dpi=300, bbox_inches='tight', facecolor='white')
    plt.close()
    print(f"✅ Project Structure: {filepath}")


def create_technology_stack():
    """Create technology stack visualization"""
    fig, ax = plt.subplots(figsize=(14, 10))
    ax.set_xlim(0, 14)
    ax.set_ylim(0, 10)
    ax.axis('off')
    ax.set_facecolor('#f8f9fa')

    # Title
    ax.text(7, 9.5, '🛠️ Technology Stack - Health Predictor V2', fontsize=18, fontweight='bold', 
            ha='center', bbox=dict(boxstyle='round,pad=0.5', facecolor='#2c3e50', edgecolor='none'), 
            color='white')

    # Stack categories
    stacks = [
        {
            'title': '🖥️ Frontend',
            'x': 2,
            'y': 7.5,
            'color': '#3498db',
            'techs': ['Next.js', 'React', 'TypeScript', 'TailwindCSS', 'NextAuth.js']
        },
        {
            'title': '⚡ Backend',
            'x': 7,
            'y': 7.5,
            'color': '#2ecc71',
            'techs': ['Python', 'Flask', 'REST API', 'Pandas', 'NumPy']
        },
        {
            'title': '🤖 ML/AI',
            'x': 12,
            'y': 7.5,
            'color': '#9b59b6',
            'techs': ['Scikit-learn', 'SVM', 'Logistic Reg.', 'MLP', 'Jupyter']
        },
        {
            'title': '📊 Data',
            'x': 2,
            'y': 4,
            'color': '#e74c3c',
            'techs': ['CSV Files', 'Pandas DF', 'Label Encoding', 'Train/Test Split', 'Preprocessing']
        },
        {
            'title': '📈 Visualization',
            'x': 7,
            'y': 4,
            'color': '#f39c12',
            'techs': ['Matplotlib', 'Seaborn', 'Plotly', 'Confusion Matrix', 'ROC Curves']
        },
        {
            'title': '💾 Storage',
            'x': 12,
            'y': 4,
            'color': '#1abc9c',
            'techs': ['Pickle', 'Joblib', 'SQLite', 'JSON Config', 'Model .sav']
        },
    ]

    for stack in stacks:
        # Title box
        title_box = FancyBboxPatch((stack['x']-1.8, stack['y']-0.3), 3.6, 0.6, 
                                   boxstyle="round,pad=0.05", facecolor=stack['color'], 
                                   edgecolor='#2c3e50', linewidth=2)
        ax.add_patch(title_box)
        ax.text(stack['x'], stack['y'], stack['title'], fontsize=11, fontweight='bold', 
               ha='center', va='center', color='white')

        # Tech items
        for i, tech in enumerate(stack['techs']):
            tech_box = FancyBboxPatch((stack['x']-1.6, stack['y']-1.2-(i*0.35)), 3.2, 0.3, 
                                      boxstyle="round,pad=0.02", facecolor='#ecf0f1', 
                                      edgecolor=stack['color'], linewidth=1)
            ax.add_patch(tech_box)
            ax.text(stack['x'], stack['y']-1.05-(i*0.35), f'• {tech}', fontsize=8, 
                   ha='center', va='center', color='#2c3e50')

    # Bottom summary
    summary_box = FancyBboxPatch((0.5, 0.2), 13, 0.6, boxstyle="round,pad=0.1", 
                                 facecolor='#34495e', edgecolor='#2c3e50', linewidth=2)
    ax.add_patch(summary_box)
    ax.text(7, 0.5, '✨ Modern Full-Stack Architecture with Machine Learning Integration | '
                   'Real-time Predictions | Multi-disease Support | Responsive UI', 
           fontsize=9, ha='center', va='center', color='white', fontweight='bold')

    plt.tight_layout()
    filepath = output_dir / 'technology_stack.png'
    plt.savefig(filepath, dpi=300, bbox_inches='tight', facecolor='#f8f9fa')
    plt.close()
    print(f"✅ Technology Stack: {filepath}")


def create_models_comparison():
    """Create models comparison visualization"""
    fig, ax = plt.subplots(figsize=(14, 8))
    
    models = ['Diabetes\n(SVM)', 'Heart\n(LR+SVM)', "Parkinson's\n(SVM)", 'Common\n(LR+MLP)']
    accuracy = [0.78, 0.85, 0.87, 0.97]
    colors = ['#e74c3c', '#e67e22', '#1abc9c', '#3498db']
    
    x_pos = np.arange(len(models))
    bars = ax.bar(x_pos, accuracy, color=colors, edgecolor='#2c3e50', linewidth=2)
    
    ax.set_ylabel('Accuracy Score', fontsize=13, fontweight='bold')
    ax.set_xlabel('Disease Prediction Model', fontsize=13, fontweight='bold')
    ax.set_title('🏥 Health Predictor V2 - Models Performance Comparison', fontsize=16, fontweight='bold', pad=20)
    ax.set_xticks(x_pos)
    ax.set_xticklabels(models, fontsize=11, fontweight='bold')
    ax.set_ylim(0, 1.1)
    ax.axhline(y=0.8, color='gray', linestyle='--', alpha=0.5, linewidth=2, label='80% Threshold')
    ax.grid(axis='y', alpha=0.3, linestyle='--')
    
    # Add value labels on bars
    for bar, acc in zip(bars, accuracy):
        height = bar.get_height()
        ax.text(bar.get_x() + bar.get_width()/2., height + 0.02,
                f'{acc:.0%}', ha='center', va='bottom', fontsize=12, fontweight='bold')
    
    # Add features for each model
    features = [
        '8 Features\n768 Samples',
        '13 Features\n303 Samples',
        '22 Features\n195 Samples',
        '132 Features\n4920 Samples'
    ]
    
    for i, (bar, feature) in enumerate(zip(bars, features)):
        ax.text(bar.get_x() + bar.get_width()/2., 0.05,
                feature, ha='center', va='bottom', fontsize=8, color='#34495e', style='italic')
    
    ax.legend(fontsize=10, loc='upper left')
    plt.tight_layout()
    filepath = output_dir / 'models_comparison.png'
    plt.savefig(filepath, dpi=300, bbox_inches='tight')
    plt.close()
    print(f"✅ Models Comparison: {filepath}")


def create_api_endpoints_diagram():
    """Create API endpoints diagram"""
    fig, ax = plt.subplots(figsize=(14, 10))
    ax.set_xlim(0, 14)
    ax.set_ylim(0, 10)
    ax.axis('off')
    ax.set_facecolor('#f5f6fa')

    # Title
    ax.text(7, 9.5, '🔌 API Endpoints Architecture', fontsize=18, fontweight='bold', 
            ha='center', bbox=dict(boxstyle='round,pad=0.5', facecolor='#2c3e50', edgecolor='none'), 
            color='white')

    # API categories
    endpoints = [
        {
            'category': '🔐 Authentication',
            'y': 8,
            'color': '#e74c3c',
            'routes': ['POST /auth/signin', 'POST /auth/signup', 'POST /auth/logout']
        },
        {
            'category': '🏥 Predictions',
            'y': 6.2,
            'color': '#3498db',
            'routes': [
                'POST /predict/diabetes',
                'POST /predict/heart',
                'POST /predict/parkinsons',
                'POST /predict/common'
            ]
        },
        {
            'category': '📊 History & Results',
            'y': 4,
            'color': '#2ecc71',
            'routes': ['GET /results/{id}', 'GET /user/history', 'DELETE /results/{id}']
        },
        {
            'category': '⚙️ System',
            'y': 2.2,
            'color': '#9b59b6',
            'routes': ['GET /health', 'GET /models/status', 'POST /models/reload']
        },
    ]

    for endpoint in endpoints:
        # Category header
        header_box = FancyBboxPatch((0.5, endpoint['y']-0.3), 13, 0.6, 
                                    boxstyle="round,pad=0.05", facecolor=endpoint['color'], 
                                    edgecolor='#2c3e50', linewidth=2)
        ax.add_patch(header_box)
        ax.text(1, endpoint['y'], endpoint['category'], fontsize=11, fontweight='bold', 
               ha='left', va='center', color='white')

        # Routes
        route_y = endpoint['y'] - 0.8
        for route in endpoint['routes']:
            route_box = FancyBboxPatch((1, route_y-0.25), 12, 0.4, 
                                       boxstyle="round,pad=0.02", facecolor='#ecf0f1', 
                                       edgecolor=endpoint['color'], linewidth=1)
            ax.add_patch(route_box)
            ax.text(1.2, route_y-0.05, route, fontsize=9, ha='left', va='center', 
                   color='#2c3e50', family='monospace', fontweight='bold')
            route_y -= 0.5

    plt.tight_layout()
    filepath = output_dir / 'api_endpoints.png'
    plt.savefig(filepath, dpi=300, bbox_inches='tight', facecolor='#f5f6fa')
    plt.close()
    print(f"✅ API Endpoints: {filepath}")


def main():
    """Generate all architecture diagrams"""
    print("=" * 60)
    print("Health Predictor V2 - Architecture Diagrams Generator")
    print("=" * 60)
    
    try:
        create_system_architecture()
        create_ml_pipeline_flow()
        create_data_flow_diagram()
        create_project_structure()
        create_technology_stack()
        create_models_comparison()
        create_api_endpoints_diagram()
        
        print("\n" + "=" * 60)
        print(f"✅ All diagrams generated successfully!")
        print(f"📁 Location: {output_dir.absolute()}")
        print("=" * 60)
        
        # List generated files
        print("\n📊 Generated Files:")
        for i, file in enumerate(sorted(output_dir.glob('*.png')), 1):
            print(f"   {i}. {file.name}")
        
    except Exception as e:
        print(f"\n❌ Error generating diagrams: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
