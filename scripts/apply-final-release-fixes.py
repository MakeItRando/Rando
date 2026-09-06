from pathlib import Path


def replace_once(path, old, new, label):
    file_path = Path(path)
    text = file_path.read_text()
    if old not in text:
        raise SystemExit(f'{label} anchor not found in {path}')
    file_path.write_text(text.replace(old, new, 1))


replace_once(
    'styles.css',
    '  .artist-actions .text-action { grid-column: 1 / -1; grid-row: 2; justify-self: start; width: max-content; min-width: 44px; min-height: 32px; }',
    '  .artist-actions .text-action { grid-column: 1 / -1; grid-row: 2; justify-self: start; width: max-content; min-width: 44px; min-height: 44px; }',
    'Mobile skip target',
)

replace_once(
    'src/app.js',
    "  $('previewCompletion').addEventListener('click', openCompletion);",
    "  $('previewCompletion')?.addEventListener('click', openCompletion);",
    'Preview control binding',
)
replace_once(
    'src/app.js',
    '  elements.artistCount.textContent = `${pad(allEligible.length)} sample artists`;',
    '  elements.artistCount.textContent = `${pad(allEligible.length)} artists`;',
    'Artist count copy',
)

replace_once(
    'tests/smoke.mjs',
    "  if (await page.locator('.track-row').count() !== 7) throw new Error('Matching catalog should contain seven Kairo tracks');",
    "  await page.waitForTimeout(300);\n  const initialTrackCount = await page.locator('.track-row').count();\n  if (initialTrackCount !== 7) throw new Error('Matching catalog should contain seven Kairo tracks; got ' + initialTrackCount + '; browser errors: ' + errors.join(' | '));",
    'Startup assertion',
)
replace_once(
    'tests/smoke.mjs',
    "  await page.click('#previewCompletion');\n  if (await page.locator('#completionOverlay').evaluate((node) => node.hidden)) throw new Error('Completion dialog did not open');",
    "  for (let attempts = 0; attempts < 12 && await page.locator('#completionOverlay').evaluate((node) => node.hidden); attempts += 1) {\n    await page.click('#nextTrack');\n  }\n  if (await page.locator('#completionOverlay').evaluate((node) => node.hidden)) throw new Error('Completion dialog did not open through the real end-of-artist path');",
    'Completion assertion',
)

replace_once(
    'tests/listening.mjs',
    "  await page.click('#fullJourney');\n  assert(await page.locator('#fullPlayer').isHidden(), 'Journey action should close the immersive player.');",
    "  await page.click('#fullJourney');\n  assert(await page.locator('#fullPlayer').isHidden(), 'Journey action should close the immersive player.');\n  await page.waitForTimeout(500);\n  const journeyRestored = await page.locator('#directory').evaluate((element) => ({ hidden: element.hidden, inert: element.inert, collapsed: document.body.classList.contains('journey-collapsed'), visibility: getComputedStyle(element).visibility }));\n  assert(!journeyRestored.hidden && !journeyRestored.inert && !journeyRestored.collapsed && journeyRestored.visibility === 'visible', 'Journey action should reveal the desktop Genre Journey: ' + JSON.stringify(journeyRestored));\n  assert(await page.locator('#genreSelect').isVisible(), 'Genre picker should be visible after returning from Song Room.');",
    'Journey return',
)
replace_once(
    'tests/listening.mjs',
    "  const paletteSignals = {};\n  for (const genre of ['hiphop', 'rnb', 'electronic', 'jazz']) {\n    await page.selectOption('#genreSelect', genre);\n    paletteSignals[genre] = await page.locator('html').evaluate((el) => getComputedStyle(el).getPropertyValue('--genre-accent').trim());\n  }",
    "  const paletteSignals = {\n    hiphop: await page.locator('html').evaluate((el) => getComputedStyle(el).getPropertyValue('--genre-accent').trim())\n  };\n  for (const genre of ['rnb', 'electronic', 'jazz']) {\n    if (await page.locator('body').evaluate((el) => el.classList.contains('journey-collapsed'))) {\n      await page.click('#journeyToggle');\n      await page.waitForTimeout(500);\n    }\n    assert(await page.locator('#genreSelect').isVisible(), 'Genre picker should reopen before choosing ' + genre + '.');\n    await page.selectOption('#genreSelect', genre);\n    paletteSignals[genre] = await page.locator('html').evaluate((el) => getComputedStyle(el).getPropertyValue('--genre-accent').trim());\n    assert(await page.locator('body').evaluate((el) => el.classList.contains('journey-collapsed')), 'Changing genre during playback should return to the listening canvas.');\n  }",
    'Palette journey loop',
)

song_room_path = Path('tests/song-room.mjs')
song_room = song_room_path.read_text()
if song_room.count("'Why this song is here'") != 2:
    raise SystemExit('Song Room story copy anchors not found')
song_room_path.write_text(song_room.replace("'Why this song is here'", "'Inside the track'"))

replace_once(
    'tests/personal.mjs',
    "  await page.click('[data-save-song-note]');\n  await page.click('#songRoomMoment');",
    "  await page.click('[data-save-song-note]');\n  const momentTimeline = page.locator('#fullTimeline');\n  await momentTimeline.focus();\n  await page.keyboard.press('ArrowRight');\n  await page.keyboard.press('ArrowRight');\n  const savedMomentPosition = Number(await momentTimeline.getAttribute('aria-valuenow'));\n  assert(savedMomentPosition >= 9, 'Moment test should save an intentional non-zero timestamp.');\n  await page.click('#songRoomMoment');",
    'Saved moment setup',
)
replace_once(
    'tests/personal.mjs',
    "  assert(Number(await page.locator('#fullTimeline').getAttribute('aria-valuenow')) >= 5, 'Saved moment should restore its timestamp.');",
    "  const restoredMomentPosition = Number(await page.locator('#fullTimeline').getAttribute('aria-valuenow'));\n  assert(Math.abs(restoredMomentPosition - savedMomentPosition) <= 1, 'Saved moment should restore its exact timestamp.');",
    'Saved moment assertion',
)
