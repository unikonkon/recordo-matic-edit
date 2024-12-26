import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { Navbar } from "@/components/Navbar";

const RecordingDetail = () => {
  const { id } = useParams();
  // In a real app, we would fetch the recording data based on the ID
  // For now, we'll use static data
  const recording = {
    name: "Recording Detail",
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
    url: ""
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Recordings
            </Link>
          </Button>
        </div>

        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-4">{recording.name}</h1>
          
          <div className="flex gap-4 mb-6 text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{recording.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{recording.time}</span>
            </div>
          </div>

          <div className="bg-gray-100 rounded-lg p-4">
            <audio controls className="w-full" src={recording.url} />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RecordingDetail;