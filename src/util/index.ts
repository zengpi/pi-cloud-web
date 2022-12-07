/**
 * 文件下载
 */
function byteArrayToURL(byteArray: any, mimeType: any) {
  return URL.createObjectURL(new Blob([byteArray], { type: mimeType }));
}

function exportFile(response: any) {
  const url = byteArrayToURL(
    response.data,
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );

  const link = document.createElement("a");
  link.href = url;

  if (response.headers["content-disposition"]) {
    const fileName =
      response.headers["content-disposition"].match(/filename=(.+)/);
    if (fileName != null && fileName.length > 1) {
      link.download = decodeURI(fileName[1]);
    }
  }

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export { exportFile };
