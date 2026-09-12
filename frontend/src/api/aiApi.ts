import { apiClient } from './config';
import { getDemoMode } from '../utils/helpers';

export const AI_API_URL = import.meta.env.VITE_AI_API_URL || '/ai/chat';

export interface AIChatPayload {
  message: string;
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
  context?: {
    regionId?: string;
    zoneId?: string;
    itemType?: string;
  };
}

export interface AIChatResponse {
  reply: string;
  suggestedAction?: {
    label: string;
    link: string;
  };
}

export const aiApi = {
  async sendMessage(payload: AIChatPayload): Promise<AIChatResponse> {
    if (getDemoMode()) {
      // Simulate intelligent scholarly assistant response based on Ethiopian cultural context
      await new Promise((res) => setTimeout(res, 800));
      const query = payload.message.toLowerCase();

      if (query.includes('manuscript') || query.includes('garima') || query.includes('parchment') || query.includes('ge\'ez')) {
        return {
          reply: `Wemezekr holds digitized records for over 2,450 ancient manuscripts. Among the most remarkable is Codex Garima I & II, dating to c. 390–650 CE from the Abba Garima Monastery near Adwa, written on goat vellum with illuminated evangelist portraits and Eusebian canon tables. We also preserve the complete Ge'ez Metsehafe Henok (1 Enoch) from Gunda Gunde and the royal Kebra Nagast illuminated codices.

Would you like to explore the high-resolution digital facsimiles in the Ancient Manuscripts catalog?`,
          suggestedAction: {
            label: 'View Ancient Manuscripts',
            link: '/manuscripts',
          },
        };
      }

      if (query.includes('literature') || query.includes('novel') || query.includes('book') || query.includes('author')) {
        return {
          reply: `The national literature repository documents classical and contemporary Ethiopian masterworks:
1. **Fikir Eske Meqabir** (1968) by Haddis Alemayehu – the definitive Amharic social realist epic.
2. **Tobbya** (1908) by Afework Gebre Yesus – first printed Amharic novel.
3. **Hatata** (1667) by philosopher Zera Yacob – 17th-century rationalist ethical treatise.
4. **Seenaa Oromoo** – comprehensive compilation of Gadaa generational oral histories.

All approved literary works are cataloged with publication year, language, category, and physical depository location.`,
          suggestedAction: {
            label: 'Browse Registered Literature',
            link: '/literature',
          },
        };
      }

      if (query.includes('archive') || query.includes('adwa') || query.includes('wuchale') || query.includes('treaty')) {
        return {
          reply: `The National Archives section of Wemezekr curates state treaties, imperial proclamations, and historical administrative registers:
- **Treaty of Wuchale (1889)**: Original bilingual Amharic and Italian parchment sheets showing the critical Article XVII discrepancy.
- **Battle of Adwa Field Dispatches (1896)**: Mobilization orders of Emperor Menelik II and Empress Taytu.
- **Harar Amirate Commercial Customs Register (1854)**: Trade records with Gulf of Aden ports.
- **League of Nations Appeal (1936)**: Telegraphic memoranda and Geneva speech transcriptions.`,
          suggestedAction: {
            label: 'Explore Historical Archives',
            link: '/archives',
          },
        };
      }

      if (query.includes('region') || query.includes('zone') || query.includes('tigray') || query.includes('amhara') || query.includes('oromia') || query.includes('harar')) {
        return {
          reply: `Ethiopia's heritage is mapped hierarchically:
**Ethiopia ➔ Regional State ➔ Administrative Zone ➔ Heritage Collection**.

For instance:
- **Amhara State**: Lake Tana island monasteries (Daga Estifanos), Gondar castles, and Lalibela rock churches.
- **Tigray State**: Aksum archaeological zone, Gunda Gunde scriptorium, and Garima monastery.
- **Harari State**: Harar Jugol walled historical zone with rare Arabic/Ajami manuscripts.
- **Oromia State**: Jimma Abba Jifar palace archives, Bale Sheikh Hussein shrines, and Gadaa cultural assemblies.`,
          suggestedAction: {
            label: 'Explore by Region',
            link: '/regions',
          },
        };
      }

      return {
        reply: `Greetings from the Wemezekr Heritage AI Assistant. I can assist researchers, curators, and citizens with:
- Locating specific ancient Ge'ez manuscripts and illuminated codices
- Searching regional state and zonal archive repositories
- Interpreting historical literature and classical Amharic / Afaan Oromoo texts
- Tracking registration, assessment, and conservation workflows

How may I assist your Ethiopian heritage research today?`,
        suggestedAction: {
          label: 'Search Heritage Catalog',
          link: '/explore',
        },
      };
    }

    // Call external AI endpoint configured via AI_API_URL
    const res = await apiClient.post<AIChatResponse>(AI_API_URL, payload);
    return res.data;
  },

  async askQuestion(question: string): Promise<{ answer: string; suggestedAction?: { label: string; link: string } }> {
    const res = await aiApi.sendMessage({ message: question });
    return {
      answer: res.reply,
      suggestedAction: res.suggestedAction,
    };
  },

  async analyzeManuscript(data: { title: string; script?: string; estimatedDate?: string; language?: string }): Promise<{ analysis: string; preservationAdvice: string }> {
    const prompt = `Analyze this Ethiopian manuscript: Title: ${data.title}, Script: ${data.script || "Ge'ez"}, Date: ${data.estimatedDate || "Medieval"}. Suggest preservation standards and historical context.`;
    const res = await aiApi.sendMessage({ message: prompt });
    return {
      analysis: res.reply,
      preservationAdvice: "Maintain relative humidity at 45-50%, temperature at 18-20°C, and store in acid-free archival enclosures.",
    };
  },

  async recommendRelated(itemType: string, title: string): Promise<string[]> {
    return [
      `Codex Garima Gospels (Adwa scriptorium)`,
      `Hatata of Zera Yacob (17th c. philosophical inquiry)`,
      `Treaty of Wuchale Imperial Seals (1889)`,
      `Chronicle of Emperor Menelik II`,
    ];
  },
};
