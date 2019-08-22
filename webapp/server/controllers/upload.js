module.exports = (req, res) => {
  if (Object.keys(req.files).length == 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let uploadedFile = req.files.logFile;
  let uploadedFileName = uploadedFile.name;
  let uploadedFileNameExtension = uploadedFileName.split('.').pop();

  if(uploadedFileNameExtension !== "log") {
    return res.status(400).send('Invalid File');
  }

  // Use the mv() method to place the file somewhere on your server
  uploadedFile.mv(`./uploaded_logs/${uploadedFileName}`, function(err) {
    if (err) {
      console.log(err)
      return res.status(500).send("Internal Server Error");
    }

    res.status(200).send('File uploaded!');
  });
}
