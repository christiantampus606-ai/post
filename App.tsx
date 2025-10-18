
import React, { useState, useCallback } from 'react';
import { generateImageDescription } from './services/geminiService';
import { ImageUpload } from './components/ImageUpload';
import { ResultDisplay } from './components/ResultDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { GithubIcon } from './components/Icons';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [description, setDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleImageChange = (file: File | null) => {
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setDescription('');
      setError('');
    } else {
      setImageFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(null);
    }
  };

  const handleDescribeClick = useCallback(async () => {
    if (!imageFile) {
      setError('Please upload an image first.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setDescription('');

    try {
      const generatedDescription = await generateImageDescription(imageFile);
      setDescription(generatedDescription);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to generate description: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [imageFile]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-3xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Image Describer
          </h1>
          <p className="mt-2 text-lg text-gray-400">
            Generate detailed prompts for "Nano Banana" from your images.
          </p>
        </header>

        <main className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-700">
          <ImageUpload 
            onImageChange={handleImageChange} 
            previewUrl={previewUrl}
            isLoading={isLoading} 
          />

          <div className="mt-6 text-center">
            <button
              onClick={handleDescribeClick}
              disabled={!imageFile || isLoading}
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
            >
              {isLoading ? 'Analyzing Image...' : 'Describe Image'}
            </button>
          </div>

          <div className="mt-8">
            {isLoading && <LoadingSpinner />}
            {error && <p className="text-red-400 bg-red-900/50 p-4 rounded-lg text-center">{error}</p>}
            {description && !isLoading && <ResultDisplay text={description} />}
          </div>
        </main>
        
        <footer className="text-center mt-8 text-gray-500">
            <p>Powered by Gemini</p>
            <a href="https://github.com/google/gemini-api" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-purple-400 transition-colors">
                <GithubIcon className="w-5 h-5" />
                View Gemini on GitHub
            </a>
        </footer>
      </div>
    </div>
  );
};

export default App;
