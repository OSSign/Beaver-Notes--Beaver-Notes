//
// From @ossign/azuresigntool
// This module provides a Node.js interface to the AzureSignTool, allowing you to sign files using Azure Key Vault.
// 
const fs = require('fs');
const { exec, execSync } = require('child_process');

const downloadSigntool = function({ url, dest }) {
    if (fs.existsSync(dest)) {
        console.log(`signtool already exists at ${dest}`);
        return;
    }

    try {
        execSync(
            `curl -L ${url} -o ${dest}`, { 
                stdio: 'inherit'
        });
        console.log(`Downloaded signtool from ${url} to ${dest}`);
        
    } catch (error) {
        console.log("curl is not installed, trying wget...");
        try {
            execSync(
                `wget ${url} -O ${dest}`,
                { 
                    stdio: 'inherit' 
                }
            );
            console.log(`Downloaded signtool from ${url} to ${dest}`);
        } catch (error) {
            console.log("wget is not installed, trying Invoke-WebRequest...");
            try {
                execSync(`powershell.exe -ExecutionPolicy Bypass -Command "Invoke-WebRequest -Uri ${url} -OutFile ${dest}"`, {
                    stdio: 'inherit'
                });
                console.log(`Downloaded signtool from ${url} to ${dest}`);
            } catch (error) {
                console.error("Failed to download signtool.");
                process.exit(1);
            }
        }
    }
}

exports.azuresigntool = async function({ path, args = {}, azureSigntoolPath = '' }) {
    const AST_CERT = process.env.AST_CERT || args.cert;
    const AST_IDENT = process.env.AST_IDENT || args.ident;
    const AST_SECRET = process.env.AST_SECRET || args.secret;
    const AST_TD = process.env.AST_TD || args.td;
    const AST_TENANT = process.env.AST_TENANT || args.tenant;
    const AST_TIMESTAMP = process.env.AST_TIMESTAMP || args.timestamp;
    const AST_VAULT = process.env.AST_VAULT || args.vault;

    if (!AST_CERT || !AST_IDENT || !AST_SECRET || !AST_TENANT || !AST_VAULT) {
        throw new Error('Missing required Azure Key Vault parameters: AST_CERT, AST_IDENT, AST_SECRET, AST_TENANT, AST_VAULT');
    }

    if (azureSigntoolPath == '') {
        azureSigntoolPath = 'AzureSignTool.exe';
    }

    if (!fs.existsSync(azureSigntoolPath)) {
        downloadSigntool({
            url: 'https://github.com/vcsjones/AzureSignTool/releases/download/v6.0.1/AzureSignTool-x64.exe',
            dest: azureSigntoolPath
        });
    }

    await exec(
        `${azureSigntoolPath} sign -kvu "${AST_VAULT}" -kvc "${AST_CERT}" -kvi "${AST_IDENT}" -kvs "${AST_SECRET}" --azure-key-vault-tenant-id "${AST_TENANT}" -tr "${AST_TIMESTAMP}" -td ${AST_TD} "${path}"`,
        {
            stdio: 'inherit'
        }
    );
}

exports.azuresigntoolSync = function({ path, args = {}, azureSigntoolPath = '' }) {
    const { execSync } = require('child_process');

    const AST_CERT = process.env.AST_CERT || args.cert;
    const AST_IDENT = process.env.AST_IDENT || args.ident;
    const AST_SECRET = process.env.AST_SECRET || args.secret;
    const AST_TD = process.env.AST_TD || args.td;
    const AST_TENANT = process.env.AST_TENANT || args.tenant;
    const AST_TIMESTAMP = process.env.AST_TIMESTAMP || args.timestamp;
    const AST_VAULT = process.env.AST_VAULT || args.vault;

    if (!AST_CERT || !AST_IDENT || !AST_SECRET || !AST_TENANT || !AST_VAULT) {
        throw new Error('Missing required Azure Key Vault parameters: AST_CERT, AST_IDENT, AST_SECRET, AST_TENANT, AST_VAULT');
    }

    if (azureSigntoolPath == '') {
        azureSigntoolPath = 'AzureSignTool.exe';
    }

    if (!fs.existsSync(azureSigntoolPath)) {
        downloadSigntool({
            url: 'https://github.com/vcsjones/AzureSignTool/releases/download/v6.0.1/AzureSignTool-x64.exe',
            dest: azureSigntoolPath
        });
    }

    execSync(
        `${azureSigntoolPath} sign -kvu "${AST_VAULT}" -kvc "${AST_CERT}" -kvi "${AST_IDENT}" -kvs "${AST_SECRET}" --azure-key-vault-tenant-id "${AST_TENANT}" -tr "${AST_TIMESTAMP}" -td ${AST_TD} "${path}"`,
        {
            stdio: 'inherit'
        }
    );
}