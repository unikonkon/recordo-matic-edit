import { useState, useRef } from "react";
import { Mic, Square, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

export const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState<Array<{ url: string; name: string }>>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        const timestamp = new Date().toLocaleTimeString();
        setRecordings([...recordings, { url, name: `Recording ${timestamp}` }]);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      toast({
        title: "Recording started",
        description: "Your audio is now being recorded",
      });
    } catch (err) {
      console.error("Error accessing microphone:", err);
      toast({
        title: "Error",
        description: "Could not access microphone",
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="recording-gradient rounded-xl p-8 mb-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-4">Easy Record</h2>
        <p className="mb-8">เริ่มต้นการบันทึกเสียงได้ง่าย ๆ</p>
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`recording-button ${isRecording ? 'recording' : ''} mx-auto`}
        >
          {isRecording ? <Square className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
        </button>
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
                  <span className="font-medium">{recording.name}</span>
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