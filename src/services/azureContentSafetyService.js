import axios from 'axios';
import ContentSafetyClient from "@azure-rest/ai-content-safety";
import { AzureKeyCredential } from "@azure/core-auth";

const API_KEY = '450a56bea54841209629807860df4c88';
const ENDPOINT = 'https://ia-content-moderator-lab.cognitiveservices.azure.com/';
const credential = new AzureKeyCredential(API_KEY);
const client = ContentSafetyClient(ENDPOINT, credential);

class AzureContentSafetyService {
  constructor(endpoint, apiKey) {
    this.endpoint = endpoint;
    this.apiKey = apiKey;
    this.client = ContentSafetyClient(this.endpoint, new AzureKeyCredential(this.apiKey));
  }

  async analyzeText(text) {
    const analyzeTextOption = { text };
    const analyzeTextParameters = { body: analyzeTextOption };

    try {
      const result = await this.client.path("/text:analyze").post(analyzeTextParameters);
      if (result.status === "200") {
        const unsafeCategories = result.body.categoriesAnalysis
          .filter(category => category.severity > 0)
          .map(category => ({ category: category.category, severity: category.severity }));

        return {
          isSafe: unsafeCategories.length === 0,
          unsafeCategories: unsafeCategories
        };
      } else {
        throw new Error("Error en el análisis de texto.");
      }
    } catch (error) {
      console.error("Error al analizar el texto:", error);
      throw error;
    }
  }
}

export default new AzureContentSafetyService(ENDPOINT, API_KEY);