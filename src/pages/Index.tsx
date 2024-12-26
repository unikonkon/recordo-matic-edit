import { Navbar } from "@/components/Navbar";
import { AudioRecorder } from "@/components/AudioRecorder";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <AudioRecorder />
    </div>
  );
};

export default Index;