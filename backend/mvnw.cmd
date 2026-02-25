@REM Maven Wrapper script for Windows
@echo off
setlocal

set MAVEN_PROJECTBASEDIR=%~dp0
set MAVEN_WRAPPER_JAR=%MAVEN_PROJECTBASEDIR%.mvn\wrapper\maven-wrapper.jar
set MAVEN_WRAPPER_LAUNCHER=org.apache.maven.wrapper.MavenWrapperMain
set "MAVEN_OPTS=-Dmaven.multiModuleProjectDirectory=%MAVEN_PROJECTBASEDIR:~0,-1%"

if not exist "%MAVEN_WRAPPER_JAR%" (
  echo Downloading Maven Wrapper...
  powershell -NoProfile -ExecutionPolicy Bypass -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; (New-Object Net.WebClient).DownloadFile('https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar', '%MAVEN_WRAPPER_JAR%')"
  if not exist "%MAVEN_WRAPPER_JAR%" (
    echo Failed to download. Install Maven: winget install Apache.Maven
    exit /b 1
  )
)

set JAVA_EXE=java
if defined JAVA_HOME set JAVA_EXE=%JAVA_HOME%\bin\java

"%JAVA_EXE%" "%MAVEN_OPTS%" -cp "%MAVEN_WRAPPER_JAR%" %MAVEN_WRAPPER_LAUNCHER% %*
endlocal
