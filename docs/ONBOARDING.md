# Rondo onboarding

## Goal

Create a useful taste profile without making the user feel tested. Setup is required, but every preference question provides a `Not sure yet` path. The profile can be edited later.

## Flow

### 1. Create a Rondo account

- email plus passkey or secure password;
- display name and optional avatar;
- age/region confirmation needed for catalog and explicit-content rules;
- privacy and data-use summary in plain language.

### 2. Language and region

- interface language;
- preferred music languages;
- optional lyrics-translation languages;
- country/region for content availability.

### 3. Main genres

Select at least three main genres or choose `Help me discover`. Genres are presented as a clear list with short audio-free descriptions, not an animated cloud.

### 4. Favorite artists

Search or select at least five seed artists. Recommendations remain editable and each selection can be removed before continuing.

### 5. Taste controls

- familiar ↔ unfamiliar discovery slider;
- popular ↔ deep-cut preference;
- vocal ↔ instrumental preference;
- preferred decades;
- explicit-content preference;
- album-focused ↔ track-focused listening.

### 6. Experience preferences

- lyrics shown automatically or on request;
- reduce motion;
- larger text;
- high contrast;
- autoplay at artist boundaries disabled by the confirmed continuation prompt.

### 7. Review

Show a concise taste summary before entering the app. Every item has an Edit action. The first recommended genre and artist are explained using the selected inputs.

## Result

On completion, onboarding creates:

- a `UserProfile`;
- a versioned `TasteProfile`;
- initial genre weights;
- seed artists;
- content and accessibility preferences;
- an empty Rondo library and journey history.

## Product rules

- Never require connecting an external streaming account.
- Never import contacts or unrelated profile data.
- Never hide why a preference is requested.
- Never make taste answers permanent.
- Keep the first-run flow under seven focused screens.
- Persist progress so setup can resume after interruption.
