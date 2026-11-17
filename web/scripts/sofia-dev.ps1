[CmdletBinding()]
param(
  [Parameter(Mandatory=$true, Position=0)]
  [ValidateSet('status','audit','mission','test','read')]
  [string]$Command,
  [Parameter(Mandatory=$false)]
  [ValidateLength(1,4000)]
  [string]$Task,
  [Parameter(Mandatory=$false)]
  [string]$Path
)
$ErrorActionPreference = 'Stop'
$ExpectedOwnerSid = 'S-1-5-21-3490579665-1738431559-3152549-500'
$CurrentOwnerSid = [System.Security.Principal.WindowsIdentity]::GetCurrent().User.Value
if ($CurrentOwnerSid -ne $ExpectedOwnerSid) { throw 'El agente solo está autorizado para la cuenta Windows propietaria configurada.' }
$ProjectRoot = 'D:\MagnopVS\MagnopVS_Project\11- Ecosistema\MagnopVS_Web\web'
$ResolvedRoot = (Resolve-Path -LiteralPath $ProjectRoot -ErrorAction Stop).Path
if ($ResolvedRoot.TrimEnd('\\').ToLowerInvariant() -ne $ProjectRoot.TrimEnd('\\').ToLowerInvariant()) {
  throw 'La raíz resuelta no coincide con la raíz autorizada.'
}
if ((Get-Location).Path -ne $ResolvedRoot) { Set-Location -LiteralPath $ResolvedRoot }
$Tsx = Join-Path $ResolvedRoot 'node_modules\.bin\tsx.cmd'
$Entry = Join-Path $ResolvedRoot 'src\server\sofiaDevelopmentCli.ts'
if (-not (Test-Path -LiteralPath $Tsx) -or -not (Test-Path -LiteralPath $Entry)) {
  throw 'Falta el ejecutor local tsx o el punto de entrada del agente. Ejecuta npm install únicamente mediante el procedimiento autorizado del propietario.'
}
$Arguments = @($Entry, $Command)
if ($Command -eq 'mission') {
  if ([string]::IsNullOrWhiteSpace($Task)) { throw 'mission requiere -Task "Descripción de la mejora".' }
  if ($Task -match '(?i)(api[_-]?key|secret|password|token)\s*[:=]\s*\S{16,}') { throw 'La misión parece contener credenciales; se bloqueó sin mostrar el valor.' }
  Write-Host "Misión que se ejecutará:`n$Task" -ForegroundColor Cyan
  $Arguments += @('--task', $Task)
} elseif ($Command -eq 'read') {
  if ([string]::IsNullOrWhiteSpace($Path)) { throw 'read requiere -Path con una ruta relativa.' }
  if ($PSBoundParameters.ContainsKey('Task')) { throw 'read no admite -Task.' }
  $Arguments += @('--path', $Path)
} elseif ($PSBoundParameters.ContainsKey('Task') -or $PSBoundParameters.ContainsKey('Path')) {
  throw "El comando $Command no admite -Task."
}
& $Tsx @Arguments
$ExitCode = $LASTEXITCODE
if ($ExitCode -ne 0) { throw "Sof.IA local terminó con código $ExitCode." }
