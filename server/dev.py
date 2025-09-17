"""
Development utilities for the health prediction server
"""
import os
import sys
import subprocess
from pathlib import Path

def run_command(command, description=""):
    """Run a command and handle errors"""
    if description:
        print(f"\n[INFO] {description}")
    
    print(f"Running: {command}")
    
    result = subprocess.run(command, shell=True, capture_output=True, text=True)
    
    if result.returncode == 0:
        print("[SUCCESS] Command completed")
        if result.stdout:
            print(result.stdout)
    else:
        print("[ERROR] Command failed")
        if result.stderr:
            print(result.stderr)
        return False
    
    return True

def test_models():
    """Test model loading"""
    print("[TEST] Testing model loading...")
    return run_command("python server/tests/test_models.py", "Testing ML model loading")

def test_api():
    """Test API endpoints (requires running server)"""
    print("[TEST] Testing API endpoints...")
    return run_command("python server/tests/test_api.py", "Testing API endpoints")

def start_server():
    """Start the development server"""
    print("[SERVER] Starting development server...")
    os.chdir("server")
    run_command("python app.py", "Starting FastAPI server")

def install_deps():
    """Install Python dependencies"""
    print("[INSTALL] Installing dependencies...")
    return run_command("pip install -r server/requirements.txt", "Installing Python packages")

def check_health():
    """Check server health"""
    print("[HEALTH] Checking server health...")
    return run_command("curl http://localhost:8000/health", "Checking health endpoint")

def show_help():
    """Show available commands"""
    print("""
Health Prediction Server - Development Tools

Available commands:
  test-models    Test ML model loading
  test-api       Test API endpoints (server must be running)
  start          Start the development server
  install        Install Python dependencies
  health         Check server health
  help           Show this help message

Usage:
  python server/dev.py <command>

Examples:
  python server/dev.py install
  python server/dev.py test-models
  python server/dev.py start
""")

def main():
    """Main entry point"""
    if len(sys.argv) < 2:
        show_help()
        return
    
    command = sys.argv[1].lower()
    
    # Change to project root directory
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    os.chdir(project_root)
    
    print(f"[INFO] Working directory: {os.getcwd()}")
    
    commands = {
        "test-models": test_models,
        "test-api": test_api,
        "start": start_server,
        "install": install_deps,
        "health": check_health,
        "help": show_help
    }
    
    if command in commands:
        commands[command]()
    else:
        print(f"[ERROR] Unknown command: {command}")
        show_help()

if __name__ == "__main__":
    main()