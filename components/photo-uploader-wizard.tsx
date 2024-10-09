'use client'

import { useState, useRef, ChangeEvent, useEffect } from 'react'
import { Button } from "../components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { AlertCircle, Upload, Check, ThumbsUp, ThumbsDown, Camera } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert"

export function PhotoUploaderWizardComponent() {
  const [step, setStep] = useState(1)
  const [file, setFile] = useState<File | null>(null)
  const [titleText, setTitleText] = useState('איך אני היום')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [, setUploadComplete] = useState(false)
  const [photoQuality, setPhotoQuality] = useState<'good' | 'bad' | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const newTitleText = photoQuality === 'good' ? 'אני בטוב' : 'אני לא בטוב'
    if (step >= 2) {
      setTitleText(newTitleText)
    } else {
      setTitleText('איך אני היום')
    }
  }, [photoQuality, step])

  const handleFileSelect = (selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) {
      setError('Please select an image file.')
      return
    }
    setFile(selectedFile)
    setPreviewUrl(URL.createObjectURL(selectedFile))
    setError(null)
    setStep(2)
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file || !photoQuality) return

    setUploading(true)
    // Simulating an upload process
    await new Promise(resolve => setTimeout(resolve, 2000))
    setUploading(false)
    setUploadComplete(true)
    setStep(3)
  }

  const resetWizard = () => {
    setFile(null)
    setPreviewUrl(null)
    setError(null)
    setUploading(false)
    setUploadComplete(false)
    setPhotoQuality(null)
    setStep(1)
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setPhotoQuality('good')}
                className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ease-in-out ${
                  photoQuality === 'good'
                    ? 'bg-green-500 text-white scale-105'
                    : 'bg-gray-200 text-gray-800 hover:bg-green-100'
                }`}
              >
                <ThumbsUp className={`w-5 h-5 ${photoQuality === 'good' ? 'animate-bounce' : ''}`} />
                <span>בטוב</span>
              </button>
              <button
                onClick={() => setPhotoQuality('bad')}
                className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ease-in-out ${
                  photoQuality === 'bad'
                    ? 'bg-red-500 text-white scale-105'
                    : 'bg-gray-200 text-gray-800 hover:bg-red-100'
                }`}
              >
                <ThumbsDown className={`w-5 h-5 ${photoQuality === 'bad' ? 'animate-bounce' : ''}`} />
                <span>לא בטוב</span>
              </button>
            </div>
            {photoQuality && (
              <div className="flex justify-center space-x-4 animate-fade-in">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
                >
                  <Upload className="w-5 h-5" />
                </button>
                <button
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex items-center justify-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-300"
                >
                  <Camera className="w-5 h-5" />
                </button>
              </div>
            )}
            <Input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              accept="image/*"
            />
            <Input
              type="file"
              ref={cameraInputRef}
              className="hidden"
              onChange={handleFileChange}
              accept="image/*"
              capture="environment"
            />
          </div>
        )
      case 2:
        return (
          <div className="space-y-4">
            {previewUrl && (
              <div className="relative w-full h-full">
                <img src={previewUrl} alt="Preview" className="rounded-lg object-cover w-full h-full" />
              </div>
            )}
            <div className="flex justify-between items-center">
              <Button variant="outline" onClick={handleUpload} disabled={uploading || !photoQuality}>
                {uploading ? 'מעלה...' : 'מושלם'}
              </Button>
              <Button variant="destructive" onClick={resetWizard}>
                יצאתי טוב מידי
              </Button>
            </div>
          </div>
        )
      case 3:
        return (
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-green-100 rounded-full">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold">יום מושלם</h3>
            <p className="text-sm text-gray-600">Your photo has been successfully uploaded.</p>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className={`min-h-screen flex items-center justify-center animated-gradient ${photoQuality || 'default'}`}>
      <style jsx>{`
        .animated-gradient {
          background-size: 300% 300%;
          animation: gradient 15s ease infinite;
          transition: background-image 0.5s ease-in-out;
        }
        .animated-gradient.default {
          background-image: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
        }
        .animated-gradient.good {
          background-image: linear-gradient(-45deg, #7cffcb, #74f2ce, #63e6be, #48c9b0);
        }
        .animated-gradient.bad {
          background-image: linear-gradient(-45deg, #ffcccb, #ffa8a8, #ff8585, #ff6b6b);
        }
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
      `}</style>
      <Card className="w-[300px] shadow-xl">
        <CardHeader>
          <CardTitle>{titleText}</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {renderStep()}
        </CardContent>
        <CardFooter className="flex justify-between">
        </CardFooter>
      </Card>
    </div>
  )
}