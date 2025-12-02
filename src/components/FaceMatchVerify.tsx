'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Webcam from 'react-webcam'
import * as faceapi from '@vladmandic/face-api'
import { Camera, Upload, CheckCircle, XCircle, Loader2 } from 'lucide-react'

interface FaceMatchVerifyProps {
    onVerified: () => void
}

export default function FaceMatchVerify({ onVerified }: FaceMatchVerifyProps) {
    const [modelsLoaded, setModelsLoaded] = useState(false)
    const [loadingMessage, setLoadingMessage] = useState('Loading AI Models...')

    // Step 1: Upload
    const [uploadedImage, setUploadedImage] = useState<string | null>(null)
    const [referenceDescriptor, setReferenceDescriptor] = useState<Float32Array | null>(null)
    const [uploadError, setUploadError] = useState<string | null>(null)
    const [isProcessingUpload, setIsProcessingUpload] = useState(false)

    // Step 2: Webcam
    const webcamRef = useRef<Webcam>(null)
    const [isWebcamActive, setIsWebcamActive] = useState(false)
    const [isScanning, setIsScanning] = useState(false)
    const [matchScore, setMatchScore] = useState<number | null>(null)
    const [isMatch, setIsMatch] = useState<boolean | null>(null)

    // Load Models
    useEffect(() => {
        const loadModels = async () => {
            try {
                const MODEL_URL = '/models'
                await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL)
                await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
                await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
                setModelsLoaded(true)
            } catch (error) {
                console.error('Error loading models:', error)
                setLoadingMessage('Error loading AI models. Please refresh.')
            }
        }
        loadModels()
    }, [])

    // Handle File Upload
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return

        const file = e.target.files[0]
        const imgUrl = URL.createObjectURL(file)
        setUploadedImage(imgUrl)
        setUploadError(null)
        setReferenceDescriptor(null)
        setIsProcessingUpload(true)
        setIsMatch(null)
        setMatchScore(null)

        try {
            // Create an HTMLImageElement to pass to face-api
            const img = document.createElement('img')
            img.src = imgUrl
            img.onload = async () => {
                const detection = await faceapi.detectSingleFace(img, new faceapi.SsdMobilenetv1Options())
                    .withFaceLandmarks()
                    .withFaceDescriptor()

                if (detection) {
                    setReferenceDescriptor(detection.descriptor)
                    setIsProcessingUpload(false)
                } else {
                    setUploadError('No face detected. Please upload a clear selfie.')
                    setIsProcessingUpload(false)
                    setUploadedImage(null)
                }
            }
        } catch (error) {
            console.error('Error processing image:', error)
            setUploadError('Failed to process image.')
            setIsProcessingUpload(false)
        }
    }

    // Webcam Verification Loop
    const verifyFace = useCallback(async () => {
        if (!webcamRef.current || !webcamRef.current.video || !referenceDescriptor) return

        if (webcamRef.current.video.readyState === 4) {
            const video = webcamRef.current.video

            try {
                const detection = await faceapi.detectSingleFace(video, new faceapi.SsdMobilenetv1Options())
                    .withFaceLandmarks()
                    .withFaceDescriptor()

                if (detection) {
                    const distance = faceapi.euclideanDistance(referenceDescriptor, detection.descriptor)
                    setMatchScore(distance)

                    // Threshold: < 0.6 is a match
                    if (distance < 0.6) {
                        setIsMatch(true)
                        setIsScanning(false)
                        onVerified()
                    } else {
                        setIsMatch(false)
                    }
                }
            } catch (error) {
                console.error('Verification error:', error)
            }
        }
    }, [referenceDescriptor, onVerified])

    useEffect(() => {
        let interval: NodeJS.Timeout

        if (isScanning && isWebcamActive && referenceDescriptor && !isMatch) {
            interval = setInterval(() => {
                verifyFace()
            }, 500)
        }

        return () => clearInterval(interval)
    }, [isScanning, isWebcamActive, referenceDescriptor, isMatch, verifyFace])

    const startVerification = () => {
        setIsWebcamActive(true)
        setIsScanning(true)
        setIsMatch(null)
    }

    if (!modelsLoaded) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#d4a373] mb-4" />
                <p className="text-[#8c817c]">{loadingMessage}</p>
            </div>
        )
    }

    return (
        <div className="w-full max-w-md mx-auto space-y-8 p-4">
            {/* Step 1: Upload Photo */}
            <div className="space-y-4">
                <h3 className="font-serif text-xl text-[#1a1614] flex items-center">
                    <span className="bg-[#1a1614] text-[#ede0d4] w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">1</span>
                    Upload Reference Photo
                </h3>

                <div className="relative group">
                    {uploadedImage ? (
                        <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-[#d4a373]">
                            <img src={uploadedImage} alt="Reference" className="w-full h-full object-cover" />
                            <button
                                onClick={() => {
                                    setUploadedImage(null)
                                    setReferenceDescriptor(null)
                                    setIsMatch(null)
                                }}
                                className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs"
                            >
                                Change
                            </button>
                        </div>
                    ) : (
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#d6d1cd] rounded-xl cursor-pointer hover:bg-[#f0ebe6] transition-colors">
                            <Upload className="w-8 h-8 text-[#b0a8a4] mb-2" />
                            <span className="text-sm text-[#8c817c]">Click to upload selfie</span>
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        </label>
                    )}

                    {isProcessingUpload && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                            <Loader2 className="w-6 h-6 animate-spin text-[#d4a373]" />
                        </div>
                    )}
                </div>

                {uploadError && (
                    <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">{uploadError}</p>
                )}
            </div>

            {/* Step 2: Verify with Webcam */}
            {referenceDescriptor && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h3 className="font-serif text-xl text-[#1a1614] flex items-center">
                        <span className="bg-[#1a1614] text-[#ede0d4] w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">2</span>
                        Verify Identity
                    </h3>

                    {!isWebcamActive ? (
                        <button
                            onClick={startVerification}
                            className="w-full py-4 bg-[#1a1614] text-[#ede0d4] rounded-xl font-serif text-lg hover:scale-[1.02] transition-transform flex items-center justify-center"
                        >
                            <Camera className="w-5 h-5 mr-2" />
                            Open Camera
                        </button>
                    ) : (
                        <div className="relative rounded-2xl overflow-hidden bg-black aspect-video shadow-lg">
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                className="w-full h-full object-cover"
                                mirrored={true}
                            />

                            {/* Overlay UI */}
                            <div className="absolute inset-0 flex flex-col items-center justify-between p-4">
                                <div className="w-full flex justify-between items-start">
                                    <span className="bg-black/50 text-white px-2 py-1 rounded text-xs backdrop-blur-sm">
                                        Live Feed
                                    </span>
                                    {matchScore !== null && (
                                        <span className="bg-black/50 text-white px-2 py-1 rounded text-xs backdrop-blur-sm font-mono">
                                            Diff: {matchScore.toFixed(2)}
                                        </span>
                                    )}
                                </div>

                                {isMatch === true && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-green-500/20 backdrop-blur-sm animate-in zoom-in duration-300">
                                        <div className="bg-white p-4 rounded-full shadow-xl mb-4">
                                            <CheckCircle className="w-12 h-12 text-green-500" />
                                        </div>
                                        <h4 className="text-2xl font-serif font-bold text-white drop-shadow-md">Verified!</h4>
                                    </div>
                                )}

                                {isMatch === false && (
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-red-500/90 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center">
                                        <XCircle className="w-4 h-4 mr-2" />
                                        No Match Detected
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
