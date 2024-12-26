// fill the overview folder with files representing structure of every single folder in the vault (except overview folder itself)

async function generate_overview(tp) {
  const overviewFolder = "overview";
  const blackList = ["templates", "thinking_outloud", overviewFolder];
  const vaultFolders = new Set();
  const folderFiles = tp.app.vault.getFiles();

  function collectFolders(f) {
    const parts = f.parent.path.split("/");
    let currentPath = "";

    // Loop over parts to add each folder path to the vaultFolders set
    parts.forEach((part) => {
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      vaultFolders.add(currentPath);
    });
  }

  folderFiles.forEach((f) => collectFolders(f));

  // Function to fill and print the tree for a given folder
  async function createFileOverview(folderPath) {
    if (
      !folderPath ||
      folderPath == "/" ||
      blackList.includes(folderPath.split("/").pop())
    )
      return;

    const folderName = folderPath.split("/").pop();
    const tree = {};

    // Fill tree for this folder
    tp.app.vault.getFiles().forEach((f) => {
      if (!f.path.startsWith(folderPath)) return;
      const relativePath = f.path.slice(folderPath.length + 1);
      const pathParts = relativePath.split("/"); // Split into folder/file components
      let currentLevel = tree;

      // Build tree structure
      pathParts.forEach((part, index) => {
        if (index === pathParts.length - 1) {
          // If it's a file
          if (!currentLevel.files) {
            currentLevel.files = [];
          }
          currentLevel.files.push(f.basename);
        } else {
          // If it's a folder
          if (!currentLevel[part]) {
            currentLevel[part] = {};
          }
          currentLevel = currentLevel[part];
        }
      });
    });

    function printTree(
      currentFolder,
      currentDepth = 0,
      currentFolderName = folderName
    ) {
      let output = "";
      const tabs = currentDepth > 1 ? "\t".repeat(currentDepth) : "";

      // Print folder name
      if (currentDepth > 0) {
        output += `${tabs}- 🗀 [[${currentFolderName}]]\n`;
      }

      // Print files in the folder
      if (currentFolder.files) {
        currentFolder.files.forEach((f) => {
          const additionalTab = currentDepth > 0 ? "\t" : "";
          output += `${tabs}${additionalTab}- [[${f}]]\n`;
        });
      }

      // Recursively print subfolders
      for (const [subFolderName, subFolder] of Object.entries(currentFolder)) {
        if (subFolderName !== "files") {
          output += printTree(subFolder, currentDepth + 1, subFolderName);
        }
      }

      return output;
    }

    const folderFilePath = `${overviewFolder}/${folderName}.md`;
    const treeOutput = printTree(tree);

    console.log(tree);
    console.log(treeOutput, folderFilePath);

    await tp.app.vault.adapter.write(folderFilePath, treeOutput);
    return folderFilePath;
  }

  let expectedFiles = [];
  for (const folderPath of vaultFolders) {
    const folderName = await createFileOverview(folderPath);
    expectedFiles.push(folderName);
  }
  expectedFiles = expectedFiles.filter(Boolean);
  console.log(expectedFiles);

  tp.app.vault.getFolderByPath(overviewFolder).children.forEach((realFile) => {
    if (!expectedFiles.includes(realFile.path)) {
      tp.app.vault.delete(realFile, true);
    }
  });
}

module.exports = generate_overview;
