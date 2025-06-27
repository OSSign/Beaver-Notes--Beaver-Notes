exports.default = async function(configuration) {
  const AST_CERT = process.env.AST_CERT;
  const AST_IDENT = process.env.AST_IDENT;
  const AST_SECRET = process.env.AST_SECRET;
  const AST_TD = process.env.AST_TD;
  const AST_TENANT = process.env.AST_TENANT;
  const AST_TIMESTAMP = process.env.AST_TIMESTAMP;
  const AST_VAULT = process.env.AST_VAULT;

  require("child_process").execSync(
    `/c/a/AzureSignTool.exe sign -kvu "${AST_VAULT}" -kvc "${AST_CERT}" -kvi "${AST_IDENT}" -kvs "${AST_SECRET}" --azure-key-vault-tenant-id "${AST_TENANT}" -tr "${AST_TIMESTAMP}" -td ${AST_TD} "${configuration.path}"`,
    {
      stdio: "inherit"
    }
  );
};