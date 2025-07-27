import { useMemo, useState } from "react"
import { Card, CardContent } from "./components/ui/card"
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import { Badge } from "./components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs"
import { Switch } from "./components/ui/switch"
import { Checkbox } from "./components/ui/checkbox"
import { ScrollArea } from "./components/ui/scroll-area"
import { Separator } from "./components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "./components/ui/alert"

// Evidence model
type Evidence =
  | "EMF Level 5"
  | "Spirit Box"
  | "Ghost Orbs"
  | "Ghost Writing"
  | "Freezing Temps"
  | "D.O.T.S"
  | "Ultraviolet"

const ALL_EVIDENCE: Evidence[] = [
  "EMF Level 5",
  "Spirit Box",
  "Ghost Orbs",
  "Ghost Writing",
  "Freezing Temps",
  "D.O.T.S",
  "Ultraviolet",
]

// Unique trait toggles
const TRAITS = [
  { key: "spiritSmudge180", label: "Smudged cooldown ~180s (Spirit)" },
  { key: "wraithNoSaltDisturb", label: "Never steps in/disturbs salt (Wraith)" },
  { key: "phantomPhotoDisappear", label: "Ghost disappears from photo (Phantom)" },
  { key: "polterMultiThrow", label: "Multi-throw or strong object bursts (Poltergeist)" },
  { key: "bansheeScreamPara", label: "Distinct scream on parabolic/recorder (Banshee)" },
  { key: "bansheeTargetsOne", label: "Hunts one chosen target (Banshee)" },
  { key: "jinnFastWithBreaker", label: "Faster with breaker ON at range (Jinn)" },
  { key: "jinnEmfAtBreakerDrain", label: "EMF at breaker after 25% sanity zap (Jinn)" },
  { key: "mareNoLightOn", label: "Cannot turn ON lights; prefers lights OFF (Mare)" },
  { key: "mareEarlyInDark", label: "Earlier hunts in darkness (Mare)" },
  { key: "revenantLOS", label: "Very fast in line-of-sight, very slow otherwise (Revenant)" },
  { key: "demonEarlyHunts", label: "Earliest natural hunts or shorter smudge block (Demon)" },
  { key: "demonCrucifixRange", label: "Crucifix has increased range (Demon)" },
  { key: "yureiDoorSanity", label: "Door slam drains sanity ~15% (Yurei)" },
  { key: "yureiSmudgeTrapped", label: "Smudge traps ghost in room for ~90s (Yurei)" },
  { key: "oniNoAirball", label: "No airball events; shows full form more (Oni)" },
  { key: "yokaiTalkAggro", label: "Can hunt at high sanity if talking nearby (Yokai)" },
  { key: "yokaiHearingReduced", label: "Reduced voice hearing range while hunting (Yokai)" },
  { key: "hantuColdFast", label: "Faster in cold; temperature-dependent (Hantu)" },
  { key: "hantuBreathPowerOff", label: "Freezing breath visible on ghost when power OFF (Hantu)" },
  { key: "goryoDotsOnCamOnly", label: "DOTS visible on camera, not in-room (Goryo)" },
  { key: "mylingQuietFootsteps", label: "Quieter hunt sounds; audible only nearby (Myling)" },
  { key: "onryoFlameHunts", label: "Hunts tied to extinguished flames (Onryo)" },
  { key: "twinsDesynced", label: "Two hunt speeds or desynced actions (The Twins)" },
  { key: "twinsDoubleInteractions", label: "Double interactions in split locations (The Twins)" },
  { key: "raijuFastNearElectronics", label: "Faster near active electronics (Raiju)" },
  { key: "raiju65Electronics", label: "Can hunt ~65% near electronics (Raiju)" },
  { key: "obakeSixFingers", label: "Six-finger or double UV prints (Obake or Mimic)" },
  { key: "obakeFastFadingPrints", label: "Prints fade faster or sometimes no prints (Obake)" },
  { key: "mimicAlwaysOrbs", label: "Always shows Ghost Orbs as 4th evidence (The Mimic)" },
  { key: "moroiCursesOnBox", label: "Curses via Spirit Box or Parabolic or Recorder (Moroi)" },
  { key: "moroiFasterLowSanity", label: "Speeds up as sanity drops (Moroi)" },
  { key: "deogenSlowWhenClose", label: "Knows location; fast far and slow close (Deogen)" },
  { key: "deogenBoxBreathing", label: "Heavy breathing response on Spirit Box (Deogen)" },
  { key: "thayeAges", label: "Starts strong; weakens/ages over time (Thaye)" },
  { key: "shadeShy", label: "Will not interact/hunt with a player in the same room (Shade)" }
] as const

type TraitKey = (typeof TRAITS)[number]["key"]

type Ghost = {
  name: string
  evidence: Evidence[]
  forced?: Evidence[]
  traits: Partial<Record<TraitKey, boolean>>
  notes?: string
}

const GHOSTS: Ghost[] = [
  { name: "Spirit", evidence: ["EMF Level 5", "Spirit Box", "Ghost Writing"], traits: { spiritSmudge180: true }, notes: "Smudging the ghost delays the next hunt longer than others (about 180s)." },
  { name: "Wraith", evidence: ["EMF Level 5", "Spirit Box", "D.O.T.S"], traits: { wraithNoSaltDisturb: true }, notes: "Never steps in or disturbs salt piles; may teleport to players, leaving EMF where it arrives." },
  { name: "Phantom", evidence: ["Spirit Box", "D.O.T.S", "Ultraviolet"], traits: { phantomPhotoDisappear: true }, notes: "Disappears in photos; blinks invisible longer during hunts; can roam to a random player." },
  { name: "Poltergeist", evidence: ["Spirit Box", "Ghost Writing", "Ultraviolet"], traits: { polterMultiThrow: true }, notes: "Throws many items; multi-throws can cause big sanity drops." },
  { name: "Banshee", evidence: ["D.O.T.S", "Ghost Orbs", "Ultraviolet"], traits: { bansheeScreamPara: true, bansheeTargetsOne: true }, notes: "Targets a single player; has a distinctive parabolic or sound-recorder scream." },
  { name: "Jinn", evidence: ["EMF Level 5", "Freezing Temps", "Ultraviolet"], traits: { jinnFastWithBreaker: true, jinnEmfAtBreakerDrain: true }, notes: "Faster at range with breaker ON and line-of-sight; 25% sanity ability gives EMF at the breaker; cannot turn the breaker off directly." },
  { name: "Mare", evidence: ["Spirit Box", "Ghost Orbs", "Ghost Writing"], traits: { mareEarlyInDark: true, mareNoLightOn: true }, notes: "Hunts earlier in darkness; cannot turn lights ON; prefers turning them OFF." },
  { name: "Revenant", evidence: ["Ghost Writing", "Freezing Temps", "Ghost Orbs"], traits: { revenantLOS: true }, notes: "Very fast when it sees you; very slow when it does not." },
  { name: "Demon", evidence: ["Ghost Writing", "Freezing Temps", "Ultraviolet"], traits: { demonEarlyHunts: true, demonCrucifixRange: true }, notes: "Earliest hunts; crucifix more effective range; shorter smudge block." },
  { name: "Yurei", evidence: ["Freezing Temps", "Ghost Orbs", "D.O.T.S"], traits: { yureiDoorSanity: true, yureiSmudgeTrapped: true }, notes: "Door slam ability drains sanity; smudging traps it in its favorite room for ~90s; doors it touches fully open or close." },
  { name: "Oni", evidence: ["EMF Level 5", "D.O.T.S", "Freezing Temps"], traits: { oniNoAirball: true }, notes: "Very active; no airball ghost events; more visible during hunts and events." },
  { name: "Yokai", evidence: ["Spirit Box", "D.O.T.S", "Ghost Orbs"], traits: { yokaiTalkAggro: true, yokaiHearingReduced: true }, notes: "Triggered by nearby talking (can hunt up to ~80% if provoked); reduced voice hearing range during hunts." },
  { name: "Hantu", evidence: ["Freezing Temps", "Ghost Orbs", "Ultraviolet"], forced: ["Freezing Temps"], traits: { hantuColdFast: true, hantuBreathPowerOff: true }, notes: "Faster in colder areas; shows freezing breath on the ghost when power is OFF." },
  { name: "Goryo", evidence: ["EMF Level 5", "D.O.T.S", "Ultraviolet"], forced: ["D.O.T.S"], traits: { goryoDotsOnCamOnly: true }, notes: "DOTS seen on camera only (often when no one is in the room)." },
  { name: "Myling", evidence: ["EMF Level 5", "Ghost Writing", "Ultraviolet"], traits: { mylingQuietFootsteps: true }, notes: "Quieter hunt sounds; footsteps/vocals audible only within about 12m; more frequent paranormal sounds on parabolic/recorder." },
  { name: "Onryo", evidence: ["Spirit Box", "Ghost Orbs", "Freezing Temps"], traits: { onryoFlameHunts: true }, notes: "Hunts linked to extinguished flames; fears fire." },
  { name: "The Twins", evidence: ["EMF Level 5", "Spirit Box", "Freezing Temps"], traits: { twinsDesynced: true, twinsDoubleInteractions: true }, notes: "Two speeds (fast/slow) and split-location interactions; can hunt from a secondary spot after a wide-radius interaction." },
  { name: "Raiju", evidence: ["EMF Level 5", "D.O.T.S", "Ghost Orbs"], traits: { raijuFastNearElectronics: true, raiju65Electronics: true }, notes: "Faster near active electronics and may hunt earlier (~65%) if gear is nearby; disrupts equipment at longer range." },
  { name: "Obake", evidence: ["EMF Level 5", "Ghost Orbs", "Ultraviolet"], forced: ["Ultraviolet"], traits: { obakeSixFingers: true, obakeFastFadingPrints: true }, notes: "Rare six-finger or double prints; fingerprints may fade quickly or fail to appear; can shapeshift model during hunts." },
  { name: "The Mimic", evidence: ["Spirit Box", "Freezing Temps", "Ultraviolet"], forced: ["Ghost Orbs"], traits: { mimicAlwaysOrbs: true, obakeSixFingers: true }, notes: "Mimics other ghosts behavior; always adds Ghost Orbs as a 4th evidence." },
  { name: "Moroi", evidence: ["Spirit Box", "Ghost Writing", "Freezing Temps"], forced: ["Spirit Box"], traits: { moroiCursesOnBox: true, moroiFasterLowSanity: true }, notes: "Curses via Spirit Box/Parabolic/Sound Recorder; speeds up as team sanity drops; cure by pills over time after the curse." },
  { name: "Deogen", evidence: ["Spirit Box", "Ghost Writing", "D.O.T.S"], forced: ["Spirit Box"], traits: { deogenSlowWhenClose: true, deogenBoxBreathing: true }, notes: "Always knows your location; very slow near you, fast far away; can produce heavy breathing on Spirit Box when close." },
  { name: "Thaye", evidence: ["Ghost Writing", "Ghost Orbs", "D.O.T.S"], traits: { thayeAges: true }, notes: "Ages with time near players; fast early, slow later; activity decreases as it ages." },
  { name: "Shade", evidence: ["EMF Level 5", "Ghost Writing", "Freezing Temps"], traits: { shadeShy: true }, notes: "Very shy: will not interact, event, or hunt if a player is in the same room." }
]

// --- Cursed items: how to use + effects ---
const CURSED_ITEMS: { name: string; how: string; you: string; ghost: string; tips?: string }[] = [
  {
    name: "Tarot Cards",
    how: "Pick up and right-click to draw one card at a time (10 total).",
    you: "Big sanity swings (Sun +100%, Moon -100%), instant death (Hanged Man), revive teammate (Priestess), or cursed hunt (Death). Wheel of Fortune +/-25%.",
    ghost: "Devil forces a ghost event; Tower forces an interaction; Hermit teleports and pins ghost briefly; Death starts a cursed hunt.",
    tips: "Draw near a hiding spot. Priestess can pre-revive; Death is instant cursed hunt."
  },
  {
    name: "Ouija Board",
    how: "Activate and ask questions; always say 'Goodbye' to end.",
    you: "Each question costs sanity. If you do not say 'Goodbye' or hit 0 sanity, it breaks and starts a cursed hunt.",
    ghost: "No buff, but break triggers an immediate cursed hunt; answers reveal room/age/bone, etc.",
    tips: "Ask 'Where are you?' for favorite room. Use near hiding and end with 'Goodbye'."
  },
  {
    name: "Haunted Mirror",
    how: "Right-click to gaze; shows the ghost room while draining sanity fast.",
    you: "Rapid sanity drain; at 0 sanity the mirror shatters and starts a cursed hunt.",
    ghost: "No special buff; shatter starts a cursed hunt.",
    tips: "Peek in short bursts to catch landmarks, then navigate safely."
  },
  {
    name: "Music Box",
    how: "Right-click to play; place it down and step back.",
    you: "Sanity drains while it plays. If close when the ghost reaches it, or when the song ends, a cursed hunt starts.",
    ghost: "Lured to the box; hunt starts when song ends or if disturbed near it.",
    tips: "Set near a safe loop for easy photos during the song."
  },
  {
    name: "Summoning Circle",
    how: "Light all five candles to summon and trap the ghost briefly.",
    you: "Each candle ~16% sanity (about 80% total). After a short photo window, an immediate cursed hunt.",
    ghost: "Teleports to the circle, trapped a few seconds, then hunts.",
    tips: "Plan your escape route before the last candle; take close-up photos while trapped."
  },
  {
    name: "Voodoo Doll",
    how: "Right-click to pull a random pin; a heart pin can trigger a cursed hunt.",
    you: "Each pin costs sanity. Heart pin drops sanity sharply and starts a cursed hunt.",
    ghost: "Forces interactions (throws/touches); heart pin can force a cursed hunt.",
    tips: "Great to provoke evidence when quiet; stand near hiding."
  },
  {
    name: "Monkey Paw",
    how: "Interact and choose a wish (limited wishes per contract).",
    you: "Every wish has a drawback: mobility/vision debuffs, broken lights, locked doors, sanity penalties, or cursed hunts.",
    ghost: "Can be trapped in room, teleported, or made more active; some wishes start hunts or alter behavior windows.",
    tips: "Use 'wish for knowledge' to learn two wrong evidences; prepare for the debuff/hunt."
  }
]

// --- Media checklists (unique categories you can record) ---
const PHOTO_CATEGORIES = [
  // Ghost forms
  "Ghost", "Shadow Ghost", "Translucent Ghost", "Mist Form", "D.O.T.S. Ghost",
  // Evidence-style
  "Fingerprint", "Obake Fingerprint", "Footprint", "EMF Reading", "Freezing Temperatures", "Ghost Writing", "Object Levitating (Interaction)",
  // Bodies & bone
  "Bone", "Dead Body",
  // Cursed possessions
  "Haunted Mirror", "Monkey Paw", "Music Box", "Ouija Board", "Summoning Circle", "Tarot Cards", "Voodoo Doll",
  // Environmental
  "Dirty Water", "Burned Crucifix"
] as const

const VIDEO_CATEGORIES = [
  // Ghost footage
  "Hunting Ghost", "Ghost (Manifest)", "Shadow Ghost", "Translucent Ghost", "Mist Form", "D.O.T.S. Ghost",
  // Interactions & environment
  "Object Thrown / Interaction", "Door Moved", "Disturbed Salt", "Rocking Chair", "Ghost Orbs", "Ghost Writing", "Ouija Board Responding",
  // Lights & fire
  "Lights Switched", "Light Flickering", "Light Exploded", "Light Shattered", "Fire Interaction", "Fire Extinguish", "Ghost blows out candle",
  // Crucifix & bodies
  "Burned Crucifix", "Chapel Crucifix", "Dead Body",
  // Sensors & misc
  "Motion Sensed",
  // Notable special
  "Obake Shapeshift"
] as const

const SOUND_CATEGORIES = [
  // Paranormal vocalizations
  "Paranormal Scream", "Paranormal Breathing", "Paranormal Laughing", "Paranormal Groaning", "Paranormal Talking", "Paranormal Whisper",
  // Ghost/hunt/event
  "Hunting Ghost", "Mist Form", "Ghost Event",
  // Item/interaction sounds
  "EMF 5 Reading", "Ghost Writing", "Fire Extinguish", "Burned Crucifix", "Possessed Toy", "Music Box", "Ouija Board", "Spirit Box Response"
] as const

// Small UI helpers
function EvidencePill({ e, onClick, active, excluded }: { e: Evidence; onClick: () => void; active?: boolean; excluded?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full border text-sm transition ${
        active
          ? "bg-emerald-600 text-white border-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
          : excluded
          ? "bg-neutral-800 border-neutral-700 text-neutral-400"
          : "bg-neutral-900 border-neutral-700 text-neutral-200 hover:border-neutral-500"
      }`}
      title={excluded ? "Excluded evidence" : active ? "Included evidence" : "Click to toggle"}
    >
      {e}
    </button>
  )
}

function TraitCheckbox({ k, label, value, onChange }: { k: TraitKey; label: string; value: boolean; onChange: (k: TraitKey, v: boolean) => void }) {
  return (
    <label className="flex items-center gap-3 py-1">
      <Checkbox checked={value} onCheckedChange={(v) => onChange(k, Boolean(v))} />
      <span className="text-sm">{label}</span>
    </label>
  )
}

function CheckItem({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-3 py-1">
      <Checkbox checked={checked} onCheckedChange={(v) => onChange(Boolean(v))} />
      <span className="text-sm">{label}</span>
    </label>
  )
}

// Filter logic
function filterGhosts(
  ghosts: typeof GHOSTS,
  include: Evidence[],
  exclude: Evidence[],
  traitFlags: Partial<Record<TraitKey, boolean>>,
  query: string,
  edgeCaseObake: boolean
) {
  return ghosts.filter((g) => {
    const q = query.trim().toLowerCase()
    if (q && !(`${g.name} ${g.evidence.join(" ")} ${g.notes ?? ""}`.toLowerCase().includes(q))) return false
    if (!include.every((e) => g.evidence.includes(e) || g.forced?.includes(e))) return false
    for (const e of exclude) {
      if (edgeCaseObake && g.name === "Obake" && e === "Ultraviolet") continue
      if (g.evidence.includes(e) || g.forced?.includes(e)) return false
    }
    for (const [k, v] of Object.entries(traitFlags)) {
      if (v && !(g.traits as any)[k]) return false
    }
    return true
  })
}

export default function App() {
  const [include, setInclude] = useState<Evidence[]>([])
  const [exclude, setExclude] = useState<Evidence[]>([])
  const [traits, setTraits] = useState<Partial<Record<TraitKey, boolean>>>({})
  const [query, setQuery] = useState("")
  const [edgeCaseObake, setEdgeCaseObake] = useState(true)
  const [photoDone, setPhotoDone] = useState<string[]>([])
  const [videoDone, setVideoDone] = useState<string[]>([])
  const [soundDone, setSoundDone] = useState<string[]>([])

  const toggleInclude = (e: Evidence) => {
    setInclude((cur) => (cur.includes(e) ? cur.filter((x) => x !== e) : [...cur, e]))
    setExclude((cur) => cur.filter((x) => x !== e))
  }
  const toggleExclude = (e: Evidence) => {
    setExclude((cur) => (cur.includes(e) ? cur.filter((x) => x !== e) : [...cur, e]))
    setInclude((cur) => cur.filter((x) => x !== e))
  }

  const filtered = useMemo(() => filterGhosts(GHOSTS, include, exclude, traits, query, edgeCaseObake), [include, exclude, traits, query, edgeCaseObake])

  const resetAll = () => {
    setInclude([])
    setExclude([])
    setTraits({})
    setQuery("")
    setEdgeCaseObake(true)
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]">Phasmophobia Ghost Helper</h1>
      <p className="text-sm text-neutral-300 mt-1">Interactive evidence filter and unique-trait reference, with an equipment guide.</p>

      <Tabs defaultValue="identify" className="mt-4">
        <TabsList className="grid grid-cols-5 w-full md:w-auto bg-neutral-900/70 border border-neutral-800 rounded-xl">
          <TabsTrigger value="identify">Identify</TabsTrigger>
          <TabsTrigger value="ghosts">Ghost Library</TabsTrigger>
          <TabsTrigger value="items">Items & Tips</TabsTrigger>
          <TabsTrigger value="cursed">Cursed Items</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
        </TabsList>

        {/* Identify */}
        <TabsContent value="identify" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Left: filters */}
            <Card className="md:col-span-1">
              <CardContent className="p-4 space-y-4">
                <Alert>
                  <AlertTitle>How to use</AlertTitle>
                  <AlertDescription>
                    Click evidence to include. Use Exclude to remove evidence you tested and did not find. Add unique traits you observed (salt, photo, parabolic, etc.).
                  </AlertDescription>
                </Alert>

                <div>
                  <div className="font-semibold mb-2">Search</div>
                  <Input placeholder="Search ghost names, notes..." value={query} onChange={(e) => setQuery(e.target.value)} />
                </div>

                <div>
                  <div className="font-semibold mb-2">Include Evidence</div>
                  <div className="flex flex-wrap gap-2">
                    {ALL_EVIDENCE.map((e) => (
                      <EvidencePill key={`inc-${e}`} e={e} active={include.includes(e)} onClick={() => toggleInclude(e)} />
                    ))}
                  </div>
                </div>

                <div>
                  <div className="font-semibold mb-2">Exclude Evidence</div>
                  <div className="flex flex-wrap gap-2">
                    {ALL_EVIDENCE.map((e) => (
                      <EvidencePill key={`exc-${e}`} e={e} excluded={exclude.includes(e)} onClick={() => toggleExclude(e)} />
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="font-semibold">Edge-case logic</div>
                  <div className="flex items-center gap-2 text-sm">
                    <span>Allow Obake without UV</span>
                    <Switch checked={edgeCaseObake} onCheckedChange={(v) => setEdgeCaseObake(Boolean(v))} />
                  </div>
                </div>

                <div>
                  <div className="font-semibold mb-2">Unique Traits / Tests</div>
                  <ScrollArea className="h-56 pr-2">
                    <div className="space-y-1">
                      {TRAITS.map((t) => (
                        <TraitCheckbox
                          key={t.key}
                          k={t.key as TraitKey}
                          label={t.label}
                          value={Boolean(traits[t.key as TraitKey])}
                          onChange={(k, v) => setTraits((cur) => ({ ...cur, [k]: v }))}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                <div className="flex gap-2">
                  <Button variant="secondary" onClick={resetAll}>Reset</Button>
                </div>
              </CardContent>
            </Card>

            {/* Right: results */}
            <div className="md:col-span-2 space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">Matches</div>
                    <div className="text-sm text-neutral-400">{filtered.length} / {GHOSTS.length}</div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
                    {filtered.map((g) => (
                      <Card key={g.name} className="hover:border-emerald-700/40 transition-colors">
                        <CardContent className="p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="font-semibold">{g.name}</div>
                            <div className="flex gap-1 flex-wrap justify-end">
                              {g.forced?.map((f) => (
                                <Badge key={`${g.name}-forced-${f}`} className="bg-amber-200 text-amber-900 border border-amber-300">forced: {f}</Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            {g.evidence.map((e) => (
                              <Badge key={`${g.name}-${e}`} variant="outline">{e}</Badge>
                            ))}
                          </div>
                          {g.notes && <p className="text-xs text-neutral-300">{g.notes}</p>}
                          <div className="flex gap-1 flex-wrap">
                            {Object.entries(g.traits)
                              .filter(([, v]) => v)
                              .slice(0, 4)
                              .map(([k]) => (
                                <Badge key={`${g.name}-t-${k}`} variant="secondary" className="text-[10px]">{TRAITS.find((t) => t.key === k)?.label.split(" (")[0]}</Badge>
                              ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Alert>
                <AlertTitle>Tip</AlertTitle>
                <AlertDescription className="text-sm">
                  Missed evidence happens. If you exclude Ultraviolet but the behavior screams Obake, keep it in mind - Obake can sometimes fail to leave prints. The Mimic always adds Ghost Orbs as a 4th evidence.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </TabsContent>

        {/* Ghost Library */}
        <TabsContent value="ghosts" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {GHOSTS.map((g) => (
              <Card key={`lib-${g.name}`}>
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">{g.name}</h3>
                    <div className="flex gap-1 flex-wrap">
                      {g.forced?.map((f) => (
                        <Badge key={`${g.name}-f-${f}`} className="bg-amber-200 text-amber-900 border border-amber-300">forced: {f}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {g.evidence.map((e) => (
                      <Badge key={`${g.name}-lib-${e}`} variant="outline">{e}</Badge>
                    ))}
                  </div>
                  {g.notes && <p className="text-sm text-neutral-300">{g.notes}</p>}
                  <div className="mt-1 flex gap-1 flex-wrap">
                    {Object.entries(g.traits)
                      .filter(([, v]) => v)
                      .map(([k]) => (
                        <Badge key={`${g.name}-lib-t-${k}`} variant="secondary" className="text-[11px]">{TRAITS.find((t) => t.key === k)?.label}</Badge>
                      ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Items */}
        <TabsContent value="items" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { name: "EMF Reader", what: "Detects EMF spikes at interactions/hunts.", help: "EMF 5; Jinn EMF at breaker; room confirmation and activity tracking." },
              { name: "Spirit Box", what: "Ask questions for vocal responses.", help: "Spirit Box; Moroi curse test; Deogen close-range breathing." },
              { name: "Ghost Writing Book", what: "Place and wait for ghost to write.", help: "Ghost Writing; combos for Spirit/Moroi/Thaye." },
              { name: "D.O.T.S Projector", what: "Projects silhouette if the ghost passes through.", help: "DOTS; Goryo camera-only DOTS check." },
              { name: "Video Camera / Head Gear", what: "Check for Ghost Orbs and DOTS via camera.", help: "Ghost Orbs; Goryo DOTS; safe truck testing." },
              { name: "UV Light (Ultraviolet)", what: "Reveals fingerprints/handprints.", help: "Ultraviolet; Obake special prints; salt footprint checks." },
              { name: "Thermometer", what: "Finds cold spots or freezing rooms.", help: "Freezing Temps; Hantu speed checks; room confirmation." },
              { name: "Photo Camera", what: "Captures events/interactions for money.", help: "Phantom test (invisible in photo); fingerprint photos; evidence logging." },
              { name: "Parabolic Microphone", what: "Picks up distant/unique paranormal sounds.", help: "Finds roaming ghost; Banshee scream ID; Myling para sounds; Moroi curse via hearing." },
              { name: "Sound Recorder", what: "Records unique ghost sounds for rewards.", help: "Confirms presence/uniques (Banshee scream, Moroi whisper)." },
              { name: "Motion/Sound Sensors", what: "Area control and tracking.", help: "Objective tracking; room confirmation; Raiju proximity traps." },
              { name: "Salt", what: "Place in lines or piles; footprints if UV evidence.", help: "Footprint trails (non-Wraith); Wraith never steps in salt; pair with UV." },
              { name: "Candle/Firelight", what: "Light source that resists sanity drain.", help: "Onryo flame tests; general sanity management." },
              { name: "Igniter + Incense (Smudge)", what: "Light incense to delay hunts or blind the ghost briefly.", help: "Standard hunt delay; Spirit ~180s test; Yurei room-trap; escape and loop control." },
              { name: "Crucifix", what: "Prevents hunts within radius (varies by tier).", help: "Stops standard hunts; larger effective range vs Demon; T3 can stop a cursed hunt near the possession." },
              { name: "Tripod", what: "Stabilizes cameras.", help: "Safer orb/dots watching; room coverage." },
              { name: "Sanity Pills", what: "Restores sanity.", help: "Raises threshold margin; counters Moroi post-curse over time (with pills)." }
            ].map(it => (
              <Card key={it.name}>
                <CardContent className="p-4 space-y-2">
                  <div className="font-semibold">{it.name}</div>
                  <p className="text-sm text-neutral-300">{it.what}</p>
                  <p className="text-xs text-neutral-400">Helps with: {it.help}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Alert className="mt-4">
            <AlertTitle>Accuracy note</AlertTitle>
            <AlertDescription className="text-sm">
              Traits and evidence reflect the Chronicle update era (v0.13, mid-2025). If a patch changes mechanics, update the data at the top of this file.
            </AlertDescription>
          </Alert>
        </TabsContent>

        {/* Cursed Items */}
        <TabsContent value="cursed" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {CURSED_ITEMS.map((c) => (
              <Card key={`cursed-${c.name}`}>
                <CardContent className="p-4 space-y-2">
                  <div className="font-semibold text-lg">{c.name}</div>
                  <div className="text-sm"><span className="font-semibold">How to use:</span> {c.how}</div>
                  <div className="text-sm text-neutral-300"><span className="font-semibold">Effects on you:</span> {c.you}</div>
                  <div className="text-sm text-neutral-300"><span className="font-semibold">Effects on the ghost:</span> {c.ghost}</div>
                  {c.tips && <div className="text-xs text-neutral-400"><span className="font-semibold">Tips:</span> {c.tips}</div>}
                </CardContent>
              </Card>
            ))}
          </div>
          <Alert className="mt-4">
            <AlertTitle>Safety reminder</AlertTitle>
            <AlertDescription className="text-sm">
              All cursed items can start a cursed hunt. Set up a safe path or hiding spot before using them, and keep your team informed.
            </AlertDescription>
          </Alert>
        </TabsContent>

        {/* Media (Photo / Video / Sounds) */}
        <TabsContent value="media" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {/* Photo */}
            <Card>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">Photo (Unique: 5)</div>
                  <div className="text-xs text-neutral-400">{photoDone.length} / {PHOTO_CATEGORIES.length}</div>
                </div>
                <Separator />
                <ScrollArea className="max-h-[60vh] pr-2">
                  <div className="space-y-1">
                    {PHOTO_CATEGORIES.map((label) => {
                      const checked = photoDone.includes(label)
                      return (
                        <CheckItem
                          key={`ph-${label}`}
                          label={label}
                          checked={checked}
                          onChange={(v) => setPhotoDone((cur) => v ? [...cur, label] : cur.filter((x) => x !== label))}
                        />
                      )
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Video */}
            <Card>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">Video (Unique: 5)</div>
                  <div className="text-xs text-neutral-400">{videoDone.length} / {VIDEO_CATEGORIES.length}</div>
                </div>
                <Separator />
                <ScrollArea className="max-h-[60vh] pr-2">
                  <div className="space-y-1">
                    {VIDEO_CATEGORIES.map((label) => {
                      const checked = videoDone.includes(label)
                      return (
                        <CheckItem
                          key={`vi-${label}`}
                          label={label}
                          checked={checked}
                          onChange={(v) => setVideoDone((cur) => v ? [...cur, label] : cur.filter((x) => x !== label))}
                        />
                      )
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Sounds */}
            <Card>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">Sounds (Unique: 3)</div>
                  <div className="text-xs text-neutral-400">{soundDone.length} / {SOUND_CATEGORIES.length}</div>
                </div>
                <Separator />
                <ScrollArea className="max-h-[60vh] pr-2">
                  <div className="space-y-1">
                    {SOUND_CATEGORIES.map((label) => {
                      const checked = soundDone.includes(label)
                      return (
                        <CheckItem
                          key={`so-${label}`}
                          label={label}
                          checked={checked}
                          onChange={(v) => setSoundDone((cur) => v ? [...cur, label] : cur.filter((x) => x !== label))}
                        />
                      )
                    })}
                  </div>
                </ScrollArea>
                <Alert className="mt-3">
                  <AlertTitle>Recording tip</AlertTitle>
                  <AlertDescription className="text-sm">
                    Hold Use on the Sound Recorder right as the sound happens. For Onryo tests, Fire Extinguish pairs well with candle blow-outs.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-6 text-xs text-neutral-400">
        Made for quick in-match reference. Phasmophobia (c) Kinetic Games. This fan tool is non-commercial.
      </div>
    </div>
  )
}
