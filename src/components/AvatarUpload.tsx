import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  Camera, 
  Image as ImageIcon, 
  Trash2, 
  Check, 
  RefreshCw, 
  Link, 
  Sparkles, 
  AlertCircle,
  X,
  User,
  RotateCcw,
  CheckCircle2,
  Eye
} from 'lucide-react';

export const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80'
];

interface AvatarUploadProps {
  currentAvatar: string;
  onAvatarChange: (newAvatarUrl: string) => void;
  userName?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentAvatar,
  onAvatarChange,
  userName = 'User',
  className = '',
  size = 'md',
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'camera' | 'presets' | 'url'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Camera State
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isFlashActive, setIsFlashActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  // Ensure video element is attached to stream whenever camera is active
  useEffect(() => {
    if (activeTab === 'camera' && isCameraActive && streamRef.current && videoRef.current) {
      if (videoRef.current.srcObject !== streamRef.current) {
        videoRef.current.srcObject = streamRef.current;
      }
      videoRef.current.play().catch(() => {});
    }
  }, [activeTab, isCameraActive, capturedPhoto]);

  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const startCamera = async () => {
    setCameraError(null);
    setCapturedPhoto(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('Camera access is not supported in this browser.');
        return;
      }
      // Stop previous tracks if any
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 480 }, height: { ideal: 480 }, facingMode: 'user' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.warn('Camera error:', err);
      setCameraError(err.message || 'Unable to access camera. Please allow camera permissions or upload an image file.');
    }
  };

  const takeCameraSnapshot = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    
    // Trigger visual shutter flash effect
    setIsFlashActive(true);
    setTimeout(() => setIsFlashActive(false), 200);

    const canvas = document.createElement('canvas');
    const minDim = Math.min(video.videoWidth || 320, video.videoHeight || 320);
    canvas.width = 320;
    canvas.height = 320;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const sx = ((video.videoWidth || 320) - minDim) / 2;
      const sy = ((video.videoHeight || 320) - minDim) / 2;
      ctx.drawImage(video, sx, sy, minDim, minDim, 0, 0, 320, 320);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.90);
      setCapturedPhoto(dataUrl);
      setUploadError(null);
    }
  };

  const handleRetakePhoto = async () => {
    setCapturedPhoto(null);
    setUploadError(null);

    // Verify stream tracks are active
    const hasLiveTracks = streamRef.current && streamRef.current.getTracks().some(t => t.readyState === 'live');
    if (!hasLiveTracks) {
      await startCamera();
    } else if (videoRef.current) {
      if (videoRef.current.srcObject !== streamRef.current) {
        videoRef.current.srcObject = streamRef.current;
      }
      videoRef.current.play().catch(() => {});
    }
  };

  const handleSubmitPhoto = () => {
    if (!capturedPhoto) return;
    onAvatarChange(capturedPhoto);
    stopCameraStream();
    setCapturedPhoto(null);
    setUploadError(null);
  };

  // Helper to process, downscale and compress image file
  const processImageFile = (file: File) => {
    setUploadError(null);
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WebP, etc.)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File is too large. Please select an image under 10MB.');
      return;
    }

    setIsProcessing(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      const rawDataUrl = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 320;
        let width = img.width;
        let height = img.height;

        // Square cropping logic
        const minDim = Math.min(width, height);
        const sx = (width - minDim) / 2;
        const sy = (height - minDim) / 2;

        canvas.width = MAX_SIZE;
        canvas.height = MAX_SIZE;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, MAX_SIZE, MAX_SIZE);
          const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          onAvatarChange(optimizedDataUrl);
          setIsProcessing(false);
          setUploadError(null);
        } else {
          onAvatarChange(rawDataUrl);
          setIsProcessing(false);
        }
      };
      img.onerror = () => {
        setUploadError('Could not load or decode the chosen image file.');
        setIsProcessing(false);
      };
      img.src = rawDataUrl;
    };

    reader.onerror = () => {
      setUploadError('Failed to read file from storage.');
      setIsProcessing(false);
    };

    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    onAvatarChange(urlInput.trim());
    setUrlInput('');
    setUploadError(null);
  };

  const handleResetToDefault = () => {
    onAvatarChange(AVATAR_PRESETS[0]);
    stopCameraStream();
    setUploadError(null);
  };

  const avatarSizeClass = 
    size === 'lg' ? 'w-24 h-24 sm:w-28 sm:h-28' : 
    size === 'sm' ? 'w-12 h-12' : 
    'w-16 h-16 sm:w-20 sm:h-20';

  return (
    <div className={`p-4 sm:p-5 rounded-2xl bg-[#11182B] border border-[#263550] space-y-4 ${className}`}>
      
      {/* Top Banner: Current Avatar & Primary Controls */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
        
        {/* Profile Picture Frame */}
        <div className="relative group shrink-0">
          <img
            src={currentAvatar || AVATAR_PRESETS[0]}
            alt={userName}
            className={`${avatarSizeClass} rounded-2xl object-cover border-2 border-[#38BDF8] shadow-lg shadow-[#38BDF8]/20 transition-transform group-hover:scale-102 bg-[#0B1020]`}
            onError={(e) => {
              (e.target as HTMLImageElement).src = AVATAR_PRESETS[0];
            }}
          />
          
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Upload new photo"
            className="absolute -bottom-2 -right-2 p-1.5 rounded-xl bg-gradient-to-r from-[#38BDF8] to-[#22D3EE] text-[#0B1020] shadow-md shadow-[#38BDF8]/30 hover:scale-110 active:scale-95 transition-transform cursor-pointer"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>

        {/* Info & Quick Actions */}
        <div className="flex-1 text-center sm:text-left space-y-2 min-w-0">
          <div>
            <h3 className="text-sm font-bold text-[#F8FAFC] flex items-center justify-center sm:justify-start gap-1.5">
              <span>Profile Photo</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30">
                Customizable
              </span>
            </h3>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Upload your personal photo, take a camera snapshot, or select a verified avatar.
            </p>
          </div>

          {/* Action Pills */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#0B1020] bg-[#38BDF8] hover:bg-[#22D3EE] transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-[#38BDF8]/20"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Choose Photo</span>
            </button>

            <button
              type="button"
              onClick={handleResetToDefault}
              className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-[#94A3B8] hover:text-[#F8FAFC] bg-[#17213A] hover:bg-[#1D2942] border border-[#263550] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>

      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Upload Error Banner */}
      {uploadError && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Secondary Mode Navigation Tabs */}
      <div className="flex items-center gap-1 bg-[#0B1020] p-1 rounded-xl border border-[#263550] text-xs">
        <button
          type="button"
          onClick={() => {
            stopCameraStream();
            setActiveTab('upload');
          }}
          className={`flex-1 py-1.5 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'upload'
              ? 'bg-[#1D2942] text-[#38BDF8] shadow-sm'
              : 'text-[#94A3B8] hover:text-[#F8FAFC]'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload File</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('camera');
            startCamera();
          }}
          className={`flex-1 py-1.5 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'camera'
              ? 'bg-[#1D2942] text-[#38BDF8] shadow-sm'
              : 'text-[#94A3B8] hover:text-[#F8FAFC]'
          }`}
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Camera Snapshot</span>
        </button>

        <button
          type="button"
          onClick={() => {
            stopCameraStream();
            setActiveTab('presets');
          }}
          className={`flex-1 py-1.5 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'presets'
              ? 'bg-[#1D2942] text-[#38BDF8] shadow-sm'
              : 'text-[#94A3B8] hover:text-[#F8FAFC]'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Presets</span>
        </button>

        <button
          type="button"
          onClick={() => {
            stopCameraStream();
            setActiveTab('url');
          }}
          className={`flex-1 py-1.5 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'url'
              ? 'bg-[#1D2942] text-[#38BDF8] shadow-sm'
              : 'text-[#94A3B8] hover:text-[#F8FAFC]'
          }`}
        >
          <Link className="w-3.5 h-3.5" />
          <span>Image URL</span>
        </button>
      </div>

      {/* Tab 1: Drag & Drop Zone */}
      {activeTab === 'upload' && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`p-5 rounded-xl border-2 border-dashed transition-all text-center cursor-pointer flex flex-col items-center justify-center gap-2 ${
            isDragging
              ? 'border-[#38BDF8] bg-[#38BDF8]/10'
              : 'border-[#263550] hover:border-[#38BDF8]/50 bg-[#0B1020]/60'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-[#17213A] border border-[#263550] flex items-center justify-center text-[#38BDF8]">
            {isProcessing ? (
              <RefreshCw className="w-5 h-5 animate-spin text-[#38BDF8]" />
            ) : (
              <Upload className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="text-xs font-bold text-[#F8FAFC]">
              {isProcessing ? 'Optimizing image...' : 'Click to browse or drag & drop photo here'}
            </div>
            <p className="text-[11px] text-[#94A3B8] mt-0.5">
              PNG, JPG, JPEG, WebP or GIF (Auto-cropped to square)
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Camera Capture & Live Review */}
      {activeTab === 'camera' && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0B1020] border border-[#263550] space-y-4">
          {cameraError ? (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 space-y-3 text-center">
              <div className="flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <p className="font-semibold">{cameraError}</p>
              </div>
              <button
                type="button"
                id="retry-camera-btn"
                onClick={startCamera}
                className="px-4 py-2 rounded-xl bg-amber-500 text-[#0B1020] font-bold text-xs cursor-pointer hover:bg-amber-400 transition-colors"
              >
                Retry Camera Access
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3.5">
              
              {/* Status Header Badge */}
              <div className="flex items-center gap-1.5 text-xs">
                {capturedPhoto ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Photo Captured — Review Below</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#38BDF8]/15 border border-[#38BDF8]/30 text-[#38BDF8] font-semibold">
                    <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-pulse" />
                    <span>Live Camera Feed (Align face in center)</span>
                  </span>
                )}
              </div>

              {/* Live Photo Frame Box / Captured Review Box */}
              <div className={`relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden bg-black transition-all shadow-xl ${
                capturedPhoto 
                  ? 'border-2 border-emerald-400 shadow-emerald-500/20 ring-4 ring-emerald-500/10' 
                  : 'border-2 border-[#38BDF8] shadow-[#38BDF8]/20'
              }`}>
                
                {/* Visual Shutter Flash Effect */}
                {isFlashActive && (
                  <div className="absolute inset-0 bg-white z-30 pointer-events-none animate-out fade-out duration-200" />
                )}

                {/* Permanent Live Camera Video Element (Never unmounted) */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />

                {/* Framing Guides & Crosshair (visible during live feed) */}
                {!capturedPhoto && (
                  <>
                    <div className="absolute inset-4 border border-white/20 rounded-xl pointer-events-none border-dashed" />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
                      <div className="w-20 h-20 rounded-full border border-white/40" />
                    </div>
                  </>
                )}

                {/* Review Captured Photo Layer (Placed over video when photo is taken) */}
                {capturedPhoto && (
                  <div className="absolute inset-0 z-20 bg-black">
                    <img
                      src={capturedPhoto}
                      alt="Captured snapshot preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-[#0B1020]/80 backdrop-blur-sm border border-white/20 text-[10px] font-mono text-[#F8FAFC]">
                      Snapshot
                    </div>
                  </div>
                )}

              </div>

              {/* Action Controls */}
              {capturedPhoto ? (
                /* 2 Options on Review: Retake and Submit */
                <div className="w-full max-w-xs space-y-2 pt-1">
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      id="retake-live-photo-btn"
                      onClick={handleRetakePhoto}
                      className="px-4 py-2.5 rounded-xl bg-[#17213A] hover:bg-[#1D2942] border border-[#263550] hover:border-amber-400/50 text-[#CBD5E1] hover:text-[#F8FAFC] font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                      <span>Retake</span>
                    </button>

                    <button
                      type="button"
                      id="submit-live-photo-btn"
                      onClick={handleSubmitPhoto}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-[#0B1020] font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/25 hover:opacity-95 active:scale-95 transition-all cursor-pointer"
                    >
                      <Check className="w-4 h-4 text-[#0B1020] stroke-[3]" />
                      <span>Submit</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      stopCameraStream();
                      setCapturedPhoto(null);
                    }}
                    className="w-full py-1.5 text-center text-[11px] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors cursor-pointer"
                  >
                    Cancel & Close Camera
                  </button>
                </div>
              ) : (
                /* Live Streaming Controls: Snap Photo & Close */
                <div className="flex items-center gap-2.5 pt-1">
                  <button
                    type="button"
                    id="snap-live-photo-btn"
                    onClick={takeCameraSnapshot}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#38BDF8] to-[#22D3EE] text-[#0B1020] font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-[#38BDF8]/25 hover:opacity-95 active:scale-95 transition-all cursor-pointer"
                  >
                    <Camera className="w-4 h-4 text-[#0B1020]" />
                    <span>Click Photo</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={stopCameraStream}
                    className="px-3.5 py-2.5 rounded-xl bg-[#17213A] hover:bg-[#1D2942] border border-[#263550] text-[#94A3B8] hover:text-[#F8FAFC] text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Close Camera
                  </button>
                </div>
              )}

            </div>
          )}
        </div>
      )}

      {/* Tab 3: Presets Grid */}
      {activeTab === 'presets' && (
        <div className="space-y-2">
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5 max-h-48 overflow-y-auto p-1">
            {AVATAR_PRESETS.map((url, idx) => {
              const isSelected = currentAvatar === url;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    onAvatarChange(url);
                    setUploadError(null);
                  }}
                  className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all hover:scale-105 cursor-pointer ${
                    isSelected
                      ? 'border-[#38BDF8] ring-2 ring-[#38BDF8]/50'
                      : 'border-[#263550] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                  {isSelected && (
                    <div className="absolute inset-0 bg-[#38BDF8]/25 flex items-center justify-center">
                      <Check className="w-4 h-4 text-[#0B1020] bg-[#38BDF8] rounded-full p-0.5" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: Direct URL */}
      {activeTab === 'url' && (
        <form onSubmit={handleApplyUrl} className="flex items-center gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Paste public image link (https://...)"
            className="flex-1 px-3 py-2 bg-[#0B1020] border border-[#263550] rounded-xl text-xs text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8]"
          />
          <button
            type="submit"
            disabled={!urlInput.trim()}
            className="px-3.5 py-2 rounded-xl bg-[#38BDF8] hover:bg-[#22D3EE] disabled:opacity-50 text-[#0B1020] font-bold text-xs transition-colors cursor-pointer shrink-0"
          >
            Apply
          </button>
        </form>
      )}

    </div>
  );
};
