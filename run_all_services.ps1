# Script run tất cả microservices cho CRS
# Lưu file này vào thư mục gốc của project
# Chạy: .\run_all_services.ps1

Write-Host "=== CRS Microservices Startup ===" -ForegroundColor Cyan
Write-Host ""

$services = @(
    @{
        name = "auth-service"
        port = "8081"
        path = "auth-service"
    },
    @{
        name = "course-service"
        port = "8082"
        path = "course-service"
    },
    @{
        name = "registration-service"
        port = "8083"
        path = "registration-service"
    },
    @{
        name = "api-gateway"
        port = "8080"
        path = "api-gateway"
    }
)

# Khởi động từng service trong window riêng
foreach ($service in $services) {
    Write-Host "Starting $($service.name) on port $($service.port)..." -ForegroundColor Green

    $command = "cd `"$PWD\$($service.path)`" && .\mvnw.cmd spring-boot:run"

    # Mở command prompt mới để chạy service
    Start-Process -WindowStyle Normal -FilePath "cmd.exe" -ArgumentList "/k $command" -PassThru | Out-Null

    Write-Host "$($service.name) started (window will show logs)" -ForegroundColor Yellow
    Start-Sleep -Seconds 3
}

Write-Host ""
Write-Host "=== All services started! ===" -ForegroundColor Green
Write-Host "Auth Service:        http://localhost:8081" -ForegroundColor Cyan
Write-Host "Course Service:      http://localhost:8082" -ForegroundColor Cyan
Write-Host "Registration Service: http://localhost:8083" -ForegroundColor Cyan
Write-Host "API Gateway:         http://localhost:8080" -ForegroundColor Cyan
Write-Host ""
Write-Host "Test API: http://localhost:8080/api/courses" -ForegroundColor Magenta
