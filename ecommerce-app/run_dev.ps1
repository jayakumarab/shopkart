# PowerShell script to start both Backend and Frontend for demo

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Starting Flipkart-Style E-Commerce Full-Stack App      " -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

# Start Backend
Write-Host "`nStarting FastAPI backend on http://localhost:8000..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; python -m uvicorn app.main:app --reload --port 8000"

# Start Frontend
Write-Host "`nStarting Vite React frontend on http://localhost:5173..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host "`nBoth servers started in separate terminal windows!" -ForegroundColor Cyan
Write-Host "Open frontend at: http://localhost:5173" -ForegroundColor White
Write-Host "Open API Swagger at: http://localhost:8000/docs" -ForegroundColor White

