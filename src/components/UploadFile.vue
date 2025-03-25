<template>
    <div class="flex flex-col items-center bg-white p-6 rounded-lg shadow-md w-full max-w">
      <h2 class="text-xl font-semibold mb-4">Uploader un fichier</h2>
      
      <label for="file-upload" class="cursor-pointer border-2 border-dashed border-gray-300 p-4 w-full text-center rounded-lg hover:border-blue-500 transition">
        <span class="text-gray-500">Cliquez pour sélectionner un fichier</span>
        <input id="file-upload" type="file" class="hidden" @change="handleFileUpload" />
      </label>
  
      <button 
        @click="uploadFile"
        :disabled="!selectedFile"
        class="mt-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md disabled:opacity-50 transition hover:bg-blue-600">
        Envoyer
      </button>
  
      <p v-if="uploadProgress > 0" class="mt-2 text-gray-700">
        Progression : {{ uploadProgress }}%
      </p>
      <p v-if="uploadMessage" class="mt-2 text-green-500">
        {{ uploadMessage }}
      </p>
  
      <h3 class="text-lg font-medium mt-6">Fichiers disponibles :</h3>
      <ul class="w-full mt-2 text-left">
        <li v-for="file in files" :key="file.id" class="border-b py-2">
          <a :href="file.url" target="_blank" class="text-blue-500 hover:underline">{{ file.name }}</a>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        selectedFile: null,
        uploadProgress: 0,
        uploadMessage: "",
        files: [],
      };
    },
    methods: {
      handleFileUpload(event) {
        this.selectedFile = event.target.files[0];
      },
      async uploadFile() {
        if (!this.selectedFile) return;
  
        const formData = new FormData();
        formData.append("file", this.selectedFile);
  
        try {
          await this.$axios.post("/upload", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
              this.uploadProgress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          },
          });
  
          this.uploadMessage = "Fichier envoyé avec succès !";
          this.fetchFiles();
        } catch (error) {
          this.uploadMessage = "Erreur lors de l'upload";
          console.error("Erreur d'upload :", error);
        }
      },
      async fetchFiles() {
        try {
          const response = await this.$axios.get("/files");
          this.files = response.data;
        } catch (error) {
          console.error("Erreur de récupération des fichiers :", error);
        }
      },
    },
    mounted() {
      this.fetchFiles();
    },
  };
  </script>
  