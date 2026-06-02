# Procrastinator Buddy

Inhalt:
1. Projektbeschreibung
2. Hauptfunktionen
3. Verwendete Technologien
4. Hauptworkflow
5. Installation
6. Usability Evaluation zur Version 1

---

1. Projektbeschreibung
Procrastinator Buddy ist eine Produktivitäts-Webapp zur Unterstützung beim Aufgabenmanagement und zur Reduktion von Prokrastination.  
Die Anwendung kombiniert klassische Todo-Funktionen mit Gamification-Elementen wie XP, Fortschrittsanzeigen und einem Fokus-Timer.

Die App wurde im Rahmen des Moduls „Prototyping mit KI-Tools“ entwickelt.

---

2. Hauptfunktionen

- Tasks erstellen
- Tasks anzeigen
- Tasks als erledigt markieren
- Tasks löschen
- Fokus-Timer (Pomodoro)
- XP- und Fortschrittssystem
- Profilseite mit Statistiken
- Datenpersistenz mit MongoDB

---

3. Verwendete Technologien

- SvelteKit
- MongoDB Atlas
- Netlify
- GitHub
- CSS

---

4. Hauptworkflow

1. Task erstellen
2. Task erscheint in der Übersicht
3. Fokus-Session starten
4. Task erledigen
5. XP und Fortschritt werden aktualisiert

---

5. Installation

```bash
npm install
npm run dev


6. Usability Evaluation zur Version 1

Im Rahmen der Entwicklung wurde eine erste Usability-Evaluation mit zwei Testpersonen durchgeführt. Ziel war es, die Bedienbarkeit, Navigation und Verständlichkeit der wichtigsten Funktionen zu überprüfen. Die Evaluation umfasste Aufgaben wie das Erstellen eines Tasks, die Nutzung des Fokus-Timers, das Abschliessen von Tasks sowie die Überprüfung des Fortschritts. :contentReference[oaicite:0]{index=0}

### Zusammenfassung der Ergebnisse

#### Positives Feedback
- Klares und übersichtliches Design
- Intuitive Navigation
- Gute Verknüpfung der Funktionen innerhalb der App

#### Verbesserungsvorschläge
- Unterschiedliche XP-Werte je nach Priorität eines Tasks
- Verknüpfung von Tasks mit dem Fokus-Timer
- Möglichkeit, Tasks nachträglich zu bearbeiten
- Individuelle Anpassung der Fokuszeit
- Umbenennung des Menüpunktes „Create“ zu „Task erstellen“
- Entfernen des Delete-Buttons bei bereits erledigten Tasks
- Visuelles Feedback nach Abschluss einer Fokus-Session (z. B. Emoji oder Animation wie bei Asana)

### Fazit

Die Evaluation zeigte, dass die grundlegenden Funktionen verständlich und einfach bedienbar sind. Gleichzeitig konnten mehrere Verbesserungsideen identifiziert werden, die in zukünftigen Versionen umgesetzt werden können. Die Erkenntnisse dienen als Grundlage für die Weiterentwicklung von Procrastinator Buddy. :contentReference[oaicite:1]{index=1}