import type { ProjectAnalyzeInput } from "../types/project.js";

export const SAMPLE_IDEAS: ProjectAnalyzeInput[] = [
  {
    title: "Takım görev planlama uygulaması",
    description:
      "Küçük ve orta ölçekli ekipler için görev atama, ilerleme takibi ve bildirim destekli proje yönetim aracı. Kullanıcılar görev oluşturup atayabilmeli, son teslim tarihi belirleyebilmeli ve görsel panolarda süreci izleyebilmeli.",
    targetPlatform: "Web",
    difficultyLevel: "Beginner",
    priority: "Fast MVP",
    roadmapDurationWeeks: 6,
    preferredTechnologies: "React, Node.js, SQLite",
  },
  {
    title: "Alışkanlık takip uygulaması",
    description:
      "Hatırlatma ve görsel serilerle kişisel alışkanlıkları izleme uygulaması. Kullanıcılar günlük hedefler belirleyip tamamlama oranlarını grafiklerle görebilmeli ve arkadaşlarıyla paylaşabilmeli.",
    targetPlatform: "Mobile",
    difficultyLevel: "Beginner",
    priority: "Fast MVP",
    roadmapDurationWeeks: 8,
    preferredTechnologies: "React Native, Firebase",
  },
  {
    title: "Gömülü sistem test paneli",
    description:
      "Endüstriyel sensör modüllerinden gerçek zamanlı veri okuma, uzaktan kalibrasyon ve görselleştirme paneli. Cihazlar MQTT üzerinden bağlanmalı ve dashboard üzerinde anomali tespiti yapılmalı.",
    targetPlatform: "Embedded",
    difficultyLevel: "Advanced",
    priority: "Scalability",
    roadmapDurationWeeks: 12,
    preferredTechnologies: "C++, MQTT, Grafana",
  },
  {
    title: "Yerel AI not analiz aracı",
    description:
      "Yerel dil modeli ile notları düzenleme, etiketleme ve özetleme aracı. Kullanıcılar markdown notları yazabilmeli ve yerel modelden otomatik özet ve kategori önerileri alabilmeli.",
    targetPlatform: "AI Tool",
    difficultyLevel: "Intermediate",
    priority: "Security",
    roadmapDurationWeeks: 10,
    preferredTechnologies: "Python, Ollama, Streamlit",
  },
  {
    title: "Staj takip ve raporlama sistemi",
    description:
      "Üniversiteler için öğrenci staj başvurusu, onay süreci, haftalık raporlama ve danışman değerlendirmesi. Şirketler ve öğrenciler arasında iki taraflı iletişim sağlanmalı.",
    targetPlatform: "Web",
    difficultyLevel: "Intermediate",
    priority: "Maintainability",
    roadmapDurationWeeks: 10,
    preferredTechnologies: "Next.js, PostgreSQL, Prisma",
  },
];
