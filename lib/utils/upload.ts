export async function uploadFile(file: File, folder = "uploads"): Promise<string> {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("folder", folder)

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Upload failed")
  }

  const result = await response.json()
  return result.data.url
}

export async function uploadMultipleFiles(files: File[], folder = "uploads"): Promise<string[]> {
  const uploadPromises = files.map((file) => uploadFile(file, folder))
  return Promise.all(uploadPromises)
}
