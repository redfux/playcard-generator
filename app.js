// ---------- State ----------
const MAX_STATS = 5;

const state = {
  name: '',
  stats: [{ label: '', value: '' }],
  rating: 0,
  color1: '#8EC5FC',
  color2: '#E0C3FC',
  imageDataUrl: null,
};

const GRADIENT_PRESETS = [
  ['#8EC5FC', '#E0C3FC'],
  ['#FBC2EB', '#A6C1EE'],
  ['#FDCBF1', '#E6DEE9'],
  ['#84FAB0', '#8FD3F4'],
  ['#FFECD2', '#FCB69F'],
  ['#A1C4FD', '#C2E9FB'],
  ['#F6D365', '#FDA085'],
  ['#D4FC79', '#96E6A1'],
];

// ---------- DOM references ----------
const nameInput = document.getElementById('nameInput');
const statsListEl = document.getElementById('statsList');
const addStatBtn = document.getElementById('addStatBtn');
const starPicker = document.getElementById('starPicker');
const gradientPresetsEl = document.getElementById('gradientPresets');
const color1Input = document.getElementById('color1');
const color2Input = document.getElementById('color2');

const cameraBtn = document.getElementById('cameraBtn');
const uploadBtn = document.getElementById('uploadBtn');
const cameraInput = document.getElementById('cameraInput');
const uploadInput = document.getElementById('uploadInput');

const cardInner = document.getElementById('cardInner');
const previewName = document.getElementById('previewName');
const previewImage = document.getElementById('previewImage');
const previewPlaceholder = document.getElementById('previewPlaceholder');
const previewStats = document.getElementById('previewStats');
const previewStars = document.getElementById('previewStars');

const exportBtn = document.getElementById('exportBtn');
const exportHint = document.getElementById('exportHint');

const cropperModal = document.getElementById('cropperModal');
const cropperImage = document.getElementById('cropperImage');
const cropCancelBtn = document.getElementById('cropCancelBtn');
const cropConfirmBtn = document.getElementById('cropConfirmBtn');
const zoomRange = document.getElementById('zoomRange');

let cropper = null;

// ---------- Init ----------
color1Input.value = state.color1;
color2Input.value = state.color2;

GRADIENT_PRESETS.forEach(([c1, c2], i) => {
  const swatch = document.createElement('div');
  swatch.className = 'gradient-swatch';
  swatch.style.background = `linear-gradient(135deg, ${c1}, ${c2})`;
  swatch.addEventListener('click', () => {
    state.color1 = c1;
    state.color2 = c2;
    color1Input.value = c1;
    color2Input.value = c2;
    updatePresetSelection();
    renderPreview();
  });
  swatch.dataset.c1 = c1;
  swatch.dataset.c2 = c2;
  gradientPresetsEl.appendChild(swatch);
});

function updatePresetSelection() {
  [...gradientPresetsEl.children].forEach((el) => {
    el.classList.toggle(
      'selected',
      el.dataset.c1.toLowerCase() === state.color1.toLowerCase() &&
        el.dataset.c2.toLowerCase() === state.color2.toLowerCase()
    );
  });
}
updatePresetSelection();

for (let i = 0; i < 5; i++) {
  const star = document.createElement('span');
  star.className = 'material-symbols-outlined';
  star.textContent = 'star';
  star.dataset.index = i;
  star.addEventListener('click', () => {
    state.rating = state.rating === i + 1 ? i + 1 : i + 1;
    renderStarPicker();
    renderPreview();
  });
  starPicker.appendChild(star);
}

function renderStarPicker() {
  [...starPicker.children].forEach((star, i) => {
    star.classList.toggle('filled', i < state.rating);
  });
}
renderStarPicker();

// ---------- Stats rows ----------
function renderStatsRows() {
  statsListEl.innerHTML = '';
  state.stats.forEach((stat, index) => {
    const row = document.createElement('div');
    row.className = 'stat-row';

    const labelInput = document.createElement('input');
    labelInput.className = 'stat-label';
    labelInput.placeholder = 'z.B. Stärke';
    labelInput.maxLength = 16;
    labelInput.value = stat.label;
    labelInput.addEventListener('input', () => {
      state.stats[index].label = labelInput.value;
      renderPreview();
    });

    const valueInput = document.createElement('input');
    valueInput.className = 'stat-value';
    valueInput.placeholder = 'z.B. 100 oder ein Feuerball, der 3 Runden brennt';
    valueInput.maxLength = 50;
    valueInput.value = stat.value;
    valueInput.addEventListener('input', () => {
      state.stats[index].value = valueInput.value;
      renderPreview();
    });

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'remove-stat';
    removeBtn.innerHTML = '<span class="material-symbols-outlined">close</span>';
    removeBtn.addEventListener('click', () => {
      state.stats.splice(index, 1);
      if (state.stats.length === 0) state.stats.push({ label: '', value: '' });
      renderStatsRows();
      renderPreview();
    });

    const topRow = document.createElement('div');
    topRow.className = 'stat-row-top';
    topRow.append(labelInput, removeBtn);

    row.append(topRow, valueInput);
    statsListEl.appendChild(row);
  });

  addStatBtn.disabled = state.stats.length >= MAX_STATS;
}
renderStatsRows();

addStatBtn.addEventListener('click', () => {
  if (state.stats.length >= MAX_STATS) return;
  state.stats.push({ label: '', value: '' });
  renderStatsRows();
});

// ---------- Name & colors ----------
nameInput.addEventListener('input', () => {
  state.name = nameInput.value;
  renderPreview();
  updateExportAvailability();
});

color1Input.addEventListener('input', () => {
  state.color1 = color1Input.value;
  updatePresetSelection();
  renderPreview();
});
color2Input.addEventListener('input', () => {
  state.color2 = color2Input.value;
  updatePresetSelection();
  renderPreview();
});

// ---------- Preview rendering ----------
function renderPreview() {
  previewName.textContent = state.name.trim() || 'Name';

  cardInner.style.background = `linear-gradient(135deg, ${state.color1}, ${state.color2})`;

  if (state.imageDataUrl) {
    previewImage.src = state.imageDataUrl;
    previewImage.hidden = false;
    previewPlaceholder.hidden = true;
  } else {
    previewImage.hidden = true;
    previewPlaceholder.hidden = false;
  }

  previewStats.innerHTML = '';
  state.stats
    .filter((s) => s.label.trim() || s.value.trim())
    .forEach((s) => {
      const row = document.createElement('div');
      row.className = 'stat-display-row';
      const label = document.createElement('span');
      label.className = 'stat-display-label';
      label.textContent = s.label.trim();
      const value = document.createElement('span');
      value.className = 'stat-display-value';
      value.textContent = s.value.trim();
      row.append(label, value);
      previewStats.appendChild(row);
    });

  previewStars.innerHTML = '';
  for (let i = 0; i < 5; i++) {
    const star = document.createElement('span');
    star.className = 'material-symbols-outlined' + (i < state.rating ? ' filled' : '');
    star.textContent = 'star';
    previewStars.appendChild(star);
  }
}
renderPreview();

function updateExportAvailability() {
  const ready = state.name.trim().length > 0;
  exportBtn.disabled = !ready;
  exportHint.hidden = ready;
}
updateExportAvailability();

// ---------- Image capture / upload ----------
cameraBtn.addEventListener('click', () => cameraInput.click());
uploadBtn.addEventListener('click', () => uploadInput.click());

cameraInput.addEventListener('change', (e) => handleFileSelected(e.target.files[0]));
uploadInput.addEventListener('change', (e) => handleFileSelected(e.target.files[0]));

function handleFileSelected(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => openCropper(reader.result);
  reader.readAsDataURL(file);
}

function openCropper(dataUrl) {
  cropperImage.src = dataUrl;
  cropperModal.hidden = false;
  document.body.style.overflow = 'hidden';

  if (cropper) {
    cropper.destroy();
    cropper = null;
  }

  cropper = new Cropper(cropperImage, {
    aspectRatio: 1,
    viewMode: 1,
    dragMode: 'move',
    autoCropArea: 1,
    background: false,
    responsive: true,
    zoomOnWheel: true,
    ready() {
      zoomRange.value = 0;
    },
  });
}

zoomRange.addEventListener('input', () => {
  if (!cropper) return;
  const ratio = zoomRange.value / 100;
  cropper.zoomTo(1 + ratio * 2);
});

function closeCropper() {
  cropperModal.hidden = true;
  document.body.style.overflow = '';
  if (cropper) {
    cropper.destroy();
    cropper = null;
  }
  cameraInput.value = '';
  uploadInput.value = '';
}

cropCancelBtn.addEventListener('click', closeCropper);

cropConfirmBtn.addEventListener('click', () => {
  if (!cropper) return;
  const canvas = cropper.getCroppedCanvas({ width: 900, height: 900 });
  state.imageDataUrl = canvas.toDataURL('image/jpeg', 0.92);
  renderPreview();
  closeCropper();
});

// ---------- Export to JPG ----------
const EXPORT_W = 1100;
const EXPORT_H = 1600;
const BORDER = 34;

function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

function wrapAndFitText(ctx, text, maxWidth, maxFontSize, fontFamily, weight) {
  let fontSize = maxFontSize;
  do {
    ctx.font = `${weight} ${fontSize}px ${fontFamily}`;
    if (ctx.measureText(text).width <= maxWidth || fontSize <= 24) break;
    fontSize -= 2;
  } while (true);
  return fontSize;
}

function wrapTextLines(ctx, text, maxWidth, font) {
  ctx.font = font;
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [''];
  const lines = [];
  let current = words[0];
  for (let i = 1; i < words.length; i++) {
    const test = `${current} ${words[i]}`;
    if (ctx.measureText(test).width > maxWidth) {
      lines.push(current);
      current = words[i];
    } else {
      current = test;
    }
  }
  lines.push(current);
  return lines;
}

const STAT_LABEL_FONT = "700 37px 'Roboto'";
const STAT_VALUE_FONT = "400 37px 'Roboto'";
const STAT_LINE_HEIGHT = 46;
const STAT_INLINE_GAP = 24;
const STAT_PAD_X = 36;
const STAT_PAD_Y = 22;
const STAT_ROW_GAP = 12;

function layoutStatRows(ctx, filledStats, contentW) {
  const availW = contentW - STAT_PAD_X * 2;
  const rows = filledStats.map((s) => {
    const label = s.label.trim();
    const value = s.value.trim();
    ctx.font = STAT_LABEL_FONT;
    const labelWidth = ctx.measureText(label).width;
    ctx.font = STAT_VALUE_FONT;
    const valueWidth = ctx.measureText(value).width;
    const sameLineAvail = availW - labelWidth - STAT_INLINE_GAP;
    if (value === '' || valueWidth <= sameLineAvail) {
      return { label, valueLines: [value], inline: true, height: STAT_LINE_HEIGHT };
    }
    const valueLines = wrapTextLines(ctx, value, availW, STAT_VALUE_FONT);
    return { label, valueLines, inline: false, height: STAT_LINE_HEIGHT * (1 + valueLines.length) };
  });
  const totalHeight = rows.reduce((sum, r) => sum + r.height, 0) + (rows.length - 1) * STAT_ROW_GAP;
  return { rows, totalHeight };
}

function drawStar(ctx, cx, cy, outerRadius, filled) {
  const innerRadius = outerRadius * 0.45;
  const spikes = 5;
  let rot = (Math.PI / 2) * 3;
  const step = Math.PI / spikes;
  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    let x = cx + Math.cos(rot) * outerRadius;
    let y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;
    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fillStyle = filled ? '#FFC107' : '#D9D3E0';
  ctx.fill();
  ctx.lineWidth = outerRadius * 0.12;
  ctx.strokeStyle = 'rgba(0,0,0,0.55)';
  ctx.stroke();
}

async function exportCard() {
  await document.fonts.load('700 82px "Baloo 2"');
  await document.fonts.load('700 37px "Roboto"');
  await document.fonts.ready;

  const canvas = document.createElement('canvas');
  canvas.width = EXPORT_W;
  canvas.height = EXPORT_H;
  const ctx = canvas.getContext('2d');

  // Outer white card frame
  roundRectPath(ctx, 0, 0, EXPORT_W, EXPORT_H, 48);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();

  // Inner gradient area
  const innerX = BORDER, innerY = BORDER;
  const innerW = EXPORT_W - BORDER * 2;
  const innerH = EXPORT_H - BORDER * 2;
  ctx.save();
  roundRectPath(ctx, innerX, innerY, innerW, innerH, 32);
  ctx.clip();
  const grad = ctx.createLinearGradient(innerX, innerY, innerX + innerW, innerY + innerH);
  grad.addColorStop(0, state.color1);
  grad.addColorStop(1, state.color2);
  ctx.fillStyle = grad;
  ctx.fillRect(innerX, innerY, innerW, innerH);
  ctx.restore();

  const pad = 44;
  const gap = 28;
  const contentX = innerX + pad;
  const contentW = innerW - pad * 2;
  let cursorY = innerY + pad;

  const filledStats = state.stats.filter((s) => s.label.trim() || s.value.trim());
  const statsLayout = filledStats.length > 0 ? layoutStatRows(ctx, filledStats, contentW) : null;

  const nameH = 165;
  const starsH = 90;
  const statsH = statsLayout ? STAT_PAD_Y * 2 + statsLayout.totalHeight : 0;
  const bottomPad = innerY + innerH - pad;
  const gapsCount = filledStats.length > 0 ? 3 : 2;
  const imageH = Math.max(120, bottomPad - cursorY - nameH - starsH - statsH - gap * gapsCount);

  // --- Name banner ---
  roundRectPath(ctx, contentX, cursorY, contentW, nameH, 22);
  ctx.fillStyle = 'rgba(255,255,255,0.94)';
  ctx.fill();
  const name = state.name.trim() || 'Name';
  const fontSize = wrapAndFitText(ctx, name, contentW - 60, 82, "'Baloo 2'", 700);
  ctx.font = `700 ${fontSize}px 'Baloo 2'`;
  ctx.fillStyle = '#3A2F5B';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(name, contentX + contentW / 2, cursorY + nameH / 2 + 4);
  cursorY += nameH + gap;

  // --- Image frame ---
  roundRectPath(ctx, contentX, cursorY, contentW, imageH, 22);
  ctx.fillStyle = 'rgba(255,255,255,0.88)';
  ctx.fill();

  if (state.imageDataUrl) {
    const img = await loadImage(state.imageDataUrl);
    ctx.save();
    roundRectPath(ctx, contentX, cursorY, contentW, imageH, 22);
    ctx.clip();
    drawImageCover(ctx, img, contentX, cursorY, contentW, imageH);
    ctx.restore();
  } else {
    ctx.fillStyle = '#B8B0C8';
    ctx.font = `500 32px 'Roboto'`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Kein Bild', contentX + contentW / 2, cursorY + imageH / 2);
  }
  cursorY += imageH + gap;

  // --- Stats panel ---
  if (statsLayout) {
    roundRectPath(ctx, contentX, cursorY, contentW, statsH, 22);
    ctx.fillStyle = 'rgba(255,255,255,0.94)';
    ctx.fill();

    ctx.fillStyle = '#3A2F5B';
    ctx.textBaseline = 'middle';
    let rowY = cursorY + STAT_PAD_Y;
    statsLayout.rows.forEach((row, i) => {
      if (row.inline) {
        const rowCenterY = rowY + row.height / 2;
        ctx.font = STAT_LABEL_FONT;
        ctx.textAlign = 'left';
        ctx.fillText(row.label, contentX + STAT_PAD_X, rowCenterY);
        ctx.font = STAT_VALUE_FONT;
        ctx.textAlign = 'right';
        ctx.fillText(row.valueLines[0], contentX + contentW - STAT_PAD_X, rowCenterY);
      } else {
        ctx.font = STAT_LABEL_FONT;
        ctx.textAlign = 'left';
        ctx.fillText(row.label, contentX + STAT_PAD_X, rowY + STAT_LINE_HEIGHT / 2);
        ctx.font = STAT_VALUE_FONT;
        row.valueLines.forEach((line, li) => {
          const lineY = rowY + STAT_LINE_HEIGHT * (1 + li) + STAT_LINE_HEIGHT / 2;
          ctx.fillText(line, contentX + STAT_PAD_X, lineY);
        });
      }

      if (i < statsLayout.rows.length - 1) {
        ctx.strokeStyle = 'rgba(0,0,0,0.1)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(contentX + STAT_PAD_X, rowY + row.height + STAT_ROW_GAP / 2);
        ctx.lineTo(contentX + contentW - STAT_PAD_X, rowY + row.height + STAT_ROW_GAP / 2);
        ctx.stroke();
      }
      rowY += row.height + STAT_ROW_GAP;
    });
    cursorY += statsH + gap;
  }

  // --- Stars ---
  const starCount = 5;
  const starSize = 34;
  const starGap = 26;
  const totalStarsW = starCount * starSize * 2 + (starCount - 1) * starGap;
  let starX = contentX + contentW / 2 - totalStarsW / 2 + starSize;
  const starCenterY = cursorY + starsH / 2;
  for (let i = 0; i < starCount; i++) {
    drawStar(ctx, starX, starCenterY, starSize, i < state.rating);
    starX += starSize * 2 + starGap;
  }

  canvas.toBlob(
    (blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const safeName = (state.name.trim() || 'karte').replace(/[^a-z0-9äöüß_-]+/gi, '_');
      a.href = url;
      a.download = `${safeName}-karte.jpg`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    },
    'image/jpeg',
    0.92
  );
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function drawImageCover(ctx, img, x, y, w, h) {
  const imgRatio = img.width / img.height;
  const boxRatio = w / h;
  let sx, sy, sw, sh;
  if (imgRatio > boxRatio) {
    sh = img.height;
    sw = sh * boxRatio;
    sx = (img.width - sw) / 2;
    sy = 0;
  } else {
    sw = img.width;
    sh = sw / boxRatio;
    sx = 0;
    sy = (img.height - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

exportBtn.addEventListener('click', () => {
  if (exportBtn.disabled) return;
  exportCard();
});
