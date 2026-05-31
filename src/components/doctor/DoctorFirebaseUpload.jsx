import { useEffect, useMemo, useState } from "react";
import { Alert, ProgressBar } from "react-bootstrap";

const FILE_LIMITS = {
  profileImage: 2 * 1024 * 1024,
  certificate: 5 * 1024 * 1024,
};

const ACCEPTED_PROFILE_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ACCEPTED_CERTIFICATE_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];

const validateDoctorFile = (file, kind) => {
  const isProfile = kind === "profileImage";
  const acceptedTypes = isProfile ? ACCEPTED_PROFILE_IMAGE_TYPES : ACCEPTED_CERTIFICATE_TYPES;
  const maxSize = isProfile ? FILE_LIMITS.profileImage : FILE_LIMITS.certificate;

  if (!acceptedTypes.includes(file.type)) {
    return isProfile
      ? "Profile image must be JPG, PNG, or WEBP."
      : "Certificates must be PDF, JPG, or PNG.";
  }

  if (file.size > maxSize) {
    const sizeMb = Math.round(maxSize / (1024 * 1024));
    return `File size must be ${sizeMb}MB or less.`;
  }

  return "";
};

const DoctorFirebaseUpload = ({
  mode,
  label,
  helpText,
  multiple = false,
  disabled = false,
  uploading = false,
  progress = {},
  onFilesChange,
}) => {
  const [files, setFiles] = useState([]);
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");
  const isProfile = mode === "profileImage";

  const accept = useMemo(
    () => (isProfile ? ACCEPTED_PROFILE_IMAGE_TYPES : ACCEPTED_CERTIFICATE_TYPES).join(","),
    [isProfile]
  );

  useEffect(() => {
    if (!isProfile || !files[0]) {
      setPreviewUrl("");
      return undefined;
    }

    const nextPreviewUrl = URL.createObjectURL(files[0]);
    setPreviewUrl(nextPreviewUrl);
    return () => URL.revokeObjectURL(nextPreviewUrl);
  }, [files, isProfile]);

  const handleChange = (event) => {
    const selected = Array.from(event.target.files || []);
    setError("");

    if (!selected.length) {
      setFiles([]);
      onFilesChange?.([]);
      return;
    }

    if (!isProfile && selected.length > 5) {
      setError("Upload up to 5 certificates at a time.");
      event.target.value = "";
      return;
    }

    const validationError = selected.map((file) => validateDoctorFile(file, mode)).find(Boolean);
    if (validationError) {
      setError(validationError);
      event.target.value = "";
      return;
    }

    const nextFiles = multiple ? selected : selected.slice(0, 1);
    setFiles(nextFiles);
    onFilesChange?.(nextFiles);
  };

  return (
    <div className="firebase-upload">
      <label className="form-label-soft">{label}</label>
      <div className="firebase-upload-control">
        {previewUrl && (
          <img src={previewUrl} alt="Profile preview" className="firebase-upload-preview" />
        )}
        <div className="flex-grow-1">
          <input
            className="form-control form-control-soft"
            type="file"
            accept={accept}
            multiple={multiple}
            disabled={disabled || uploading}
            onChange={handleChange}
          />
          {helpText && <div className="firebase-upload-help">{helpText}</div>}
        </div>
      </div>

      {files.length > 0 && !isProfile && (
        <div className="firebase-upload-list">
          {files.map((file, index) => (
            <div key={`${file.name}-${file.size}`} className="firebase-upload-file">
              <span>{file.name}</span>
              {uploading && <ProgressBar now={progress[index] || 0} />}
            </div>
          ))}
        </div>
      )}

      {isProfile && uploading && <ProgressBar className="mt-2" now={progress[0] || 0} label={`${progress[0] || 0}%`} />}
      {error && <Alert variant="danger" className="py-2 mt-2 mb-0">{error}</Alert>}
    </div>
  );
};

export default DoctorFirebaseUpload;
