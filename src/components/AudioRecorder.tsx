import { useState, useRef, useEffect } from "react";
import { Mic, Square, Pencil, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { addDoc, collection, getDocs } from "firebase/firestore"; // Import Firestore
import { db } from "@/lib/firebase"; // Your Firestore instance
import { ref, set } from "firebase/database";
import { rtdb } from "@/lib/firebase"; // Assuming your firebase.ts exports rtdb


export const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState<Array<{ url: string; name: string; id: string }>>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);


  const startRecording = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Your device does not support audio recording.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        const timestamp = new Date().toLocaleTimeString();
        const id = Date.now().toString(); // Unique ID

        const newRecording = { url, name: `Recording ${timestamp}`, id };
        setRecordings((prev) => [...prev, newRecording]);

        // Save to Firestore
        try {
          await addDoc(collection(db, "recordings"), {
            name: `Recording ${timestamp}`,
            url, // Blob URL (use Firebase Storage for production)
            timestamp: new Date().toISOString(),
          });

          // Save to Realtime Database
          const recordingsRef = ref(rtdb, `recordings/${id}`);
          await set(recordingsRef, {
            name: `Recording ${timestamp}`,
            url,
            timestamp: new Date().toISOString(),
          });

          toast({
            title: "Recording uploaded",
            description: "Your recording has been saved to the database",
          });
        } catch (err) {
          console.error("Error uploading to Firestore:", err);
          toast({
            title: "Error",
            description: "Failed to upload recording to the database",
            variant: "destructive",
          });
        }

        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);

      toast({
        title: "Recording started",
        description: "Your audio is now being recorded",
      });
    } catch (err) {
      console.error("Error accessing microphone:", err);
      toast({
        title: "Error",
        description: "Could not access the microphone.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      toast({
        title: "Recording stopped",
        description: "Your recording has been saved",
      });
    }
  };

  // Fetch recordings from Firestore
  const fetchRecordings = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "recordings"));
      const fetchedRecordings = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Array<{ id: string; url: string; name: string }>;

      setRecordings(fetchedRecordings);
    } catch (err) {
      console.error("Error fetching recordings:", err);
      toast({
        title: "Error",
        description: "Failed to fetch recordings from the database.",
        variant: "destructive",
      });
    }
  };

  // Fetch recordings on component load
  useEffect(() => {
    fetchRecordings();
  }, []);

  const startEditing = (index: number, name: string) => {
    setEditingIndex(index);
    setEditName(name);
  };

  const saveEdit = (index: number) => {
    const newRecordings = [...recordings];
    newRecordings[index] = { ...newRecordings[index], name: editName };
    setRecordings(newRecordings);
    setEditingIndex(null);
    toast({
      title: "Name updated",
      description: "Recording name has been updated successfully",
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('audio/')) {
        const url = URL.createObjectURL(file);
        const id = Date.now().toString(); // Generate a unique ID
        setRecordings([...recordings, { url, name: file.name, id }]);
        toast({
          title: "File uploaded",
          description: "Your audio file has been added successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Please upload an audio file",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="recording-gradient rounded-xl p-8 mb-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-4">Easy Record</h2>
        <p className="mb-8">เริ่มต้นการบันทึกเสียงได้ง่าย ๆ</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`recording-button ${isRecording ? 'recording' : ''}`}
          >
            {isRecording ? <Square className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="audio/*"
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload Audio
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {recordings.map((recording, index) => (
          <div key={index} className="audio-card">
            <div className="flex items-center justify-between mb-2">
              {editingIndex === index ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-48"
                  />
                  <Button onClick={() => saveEdit(index)} size="sm">
                    Save
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to={`/recording/${recording.id}`}
                    className="font-medium hover:text-primary transition-colors"
                  >
                    {recording.name}
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => startEditing(index, recording.name)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
            <audio src={recording.url} controls className="w-full" />
          </div>
        ))}
      </div>
    </div>
  );
};





// const startRecording = async () => {
//   try {
//     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//     mediaRecorderRef.current = new MediaRecorder(stream);
//     chunksRef.current = [];

//     mediaRecorderRef.current.ondataavailable = (e) => {
//       chunksRef.current.push(e.data);
//     };

//     mediaRecorderRef.current.onstop = () => {
//       const blob = new Blob(chunksRef.current, { type: "audio/webm" });
//       const url = URL.createObjectURL(blob);
//       const timestamp = new Date().toLocaleTimeString();
//       const id = Date.now().toString(); // Generate a unique ID
//       setRecordings([...recordings, { url, name: `Recording ${timestamp}`, id }]);
//     };

//     mediaRecorderRef.current.start();
//     setIsRecording(true);
//     toast({
//       title: "Recording started",
//       description: "Your audio is now being recorded",
//     });
//   } catch (err) {
//     console.error("Error accessing microphone:", err);
//     toast({
//       title: "Error",
//       description: "Could not access microphone",
//       variant: "destructive",
//     });
//   }
// };