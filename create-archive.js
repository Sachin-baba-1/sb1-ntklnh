const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

function createProjectArchive() {
  const output = fs.createWriteStream('project.zip');
  const archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level.
  });

  output.on('close', function() {
    console.log(archive.pointer() + ' total bytes');
    console.log('Project archive created successfully.');
  });

  archive.on('error', function(err) {
    throw err;
  });

  archive.pipe(output);

  // Add files and directories to the archive
  archive.glob('**/*', {
    ignore: ['node_modules/**', 'dist/**', '.git/**', 'project.zip', 'create-archive.js']
  });

  archive.finalize();
}

createProjectArchive();