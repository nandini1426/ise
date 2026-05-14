# StoryMaps 🗺️

> An interactive map that brings ancient Indian scriptures (Ramayana, Mahabharata) to life by showing WHERE events happened on a real map.

---

## Quick Start

```bash
npx create-react-app story-maps
cd story-maps
npm install @react-google-maps/api lucide-react
```

Then **replace** the `src/` folder with the files from this repo.

```bash
cp .env.example .env
# Add your Google Maps API key in .env
npm start
```

---

## Team

| Member | Role |
|--------|------|
| Member 1 (Nandini) | Frontend — All screens, components, routing, styles |
| Member 2 (Pranav) | Data — JSON files, images |

---

## Member 2 Instructions (Pranav)

### Add your JSON data:
- `src/data/ramayana.json` — expand with more places
- `src/data/mahabharata.json` — add all major + sub-places

### Add images:
```
public/images/
  ramayana/
    ayodhya_ram_birth.jpg
    ayodhya_exile_crossing.jpg
    ...
  mahabharata/
    ...
```

### JSON Schema (for each place's scene):
```json
{
  "id": "unique_id",
  "sceneNumber": 1,
  "title": "Scene title",
  "description": "2-3 sentences about what happened",
  "image": "/images/ramayana/filename.jpg",
  "subPlaceId": "parent_subplace_id"
}
```

---

## App Structure

```
Screen 1: BookSelector    → Choose Ramayana / Mahabharata
Screen 2: MapView         → India map with story nodes
Screen 3: StoryMap        → Zoomed place + scene strip
```

---

## GitHub Workflow

```bash
# Init
git init
git remote add origin https://github.com/YOUR_USERNAME/story-maps.git
git add .
git commit -m "feat: initial project scaffold (Member 1 frontend)"
git push -u origin main

# Pranav adds data
git checkout -b pranav/data
# ... add JSON and images ...
git push origin pranav/data
# Create PR → merge to main
```

---

## Environment

```
REACT_APP_GOOGLE_MAPS_KEY=your_key_here
```

Enable in Google Cloud Console:
- Maps JavaScript API

---

*Hackathon project — 9 hours. Good luck! 🚀*
