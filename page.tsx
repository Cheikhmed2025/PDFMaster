'use client';

import { useState } from 'react';
import FileUpload from '@/components/ui/FileUpload';
import AdBanner from '@/components/ui/AdBanner';
import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';

export default function ChiffrementPage() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
    setProgress(0);
  };

  const validatePassword = () => {
    if (password.length < 4) {
      setPasswordError('Le mot de passe doit contenir au moins 4 caractères.');
      return false;
    }
    
    if (password !== confirmPassword) {
      setPasswordError('Les mots de passe ne correspondent pas.');
      return false;
    }
    
    setPasswordError(null);
    return true;
  };

  const chiffrerPDF = async () => {
    if (!file) {
      setError('Veuillez sélectionner un fichier PDF.');
      return;
    }

    if (!validatePassword()) {
      return;
    }

    try {
      setIsProcessing(true);
      setProgress(10);

      // Lire le fichier
      const fileArrayBuffer = await file.arrayBuffer();
      setProgress(30);

      // Charger le PDF avec pdf-lib
      const pdfDoc = await PDFDocument.load(fileArrayBuffer);
      setProgress(50);

      // Chiffrer le PDF avec le mot de passe
      pdfDoc.encrypt({
        userPassword: password,
        ownerPassword: password,
        permissions: {
          printing: 'highResolution',
          modifying: false,
          copying: false,
          annotating: false,
          fillingForms: true,
          contentAccessibility: true,
          documentAssembly: false,
        },
      });
      
      setProgress(70);
      
      // Enregistrer le PDF chiffré
      const chiffrePdfBytes = await pdfDoc.save();
      setProgress(90);

      // Créer un blob et télécharger le fichier
      const blob = new Blob([chiffrePdfBytes], { type: 'application/pdf' });
      saveAs(blob, `${file.name.replace('.pdf', '')}_chiffré.pdf`);
      
      setProgress(100);
      setIsProcessing(false);
    } catch (err) {
      console.error('Erreur lors du chiffrement du PDF:', err);
      setError('Une erreur est survenue lors du chiffrement du PDF. Veuillez réessayer.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Chiffrement de PDF</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Comment ça marche ?</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Téléchargez votre fichier PDF</li>
          <li>Définissez un mot de passe sécurisé</li>
          <li>Cliquez sur "Chiffrer" et attendez que le traitement soit terminé</li>
          <li>Téléchargez votre fichier PDF chiffré</li>
        </ol>
        <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-md">
          <p className="text-sm">
            <strong>Note :</strong> Tous les traitements sont effectués localement dans votre navigateur. 
            Vos fichiers ne sont jamais envoyés à nos serveurs, garantissant ainsi la confidentialité de vos données.
          </p>
        </div>
      </div>

      <AdBanner format="auto" slot="5678901234" />

      <div className="bg-white p-6 rounded-lg shadow-md">
        {!file ? (
          <FileUpload onFileSelect={handleFileSelect} maxSize={20} />
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
              <button
                onClick={() => setFile(null)}
                className="text-red-500 hover:text-red-700"
              >
                Supprimer
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Mot de passe
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Entrez un mot de passe"
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Confirmez le mot de passe"
                />
              </div>
              
              {passwordError && (
                <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
                  {passwordError}
                </div>
              )}
              
              <div className="p-3 bg-yellow-50 text-yellow-700 rounded-md text-sm">
                <p><strong>Important :</strong> N'oubliez pas votre mot de passe ! Il n'y a aucun moyen de récupérer un PDF chiffré si vous perdez le mot de passe.</p>
              </div>
            </div>

            {isProcessing ? (
              <div className="space-y-3">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-center text-sm text-gray-600">
                  Chiffrement en cours... {progress}%
                </p>
              </div>
            ) : (
              <button
                onClick={chiffrerPDF}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition-colors"
              >
                Chiffrer le PDF
              </button>
            )}

            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-md">
                {error}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
