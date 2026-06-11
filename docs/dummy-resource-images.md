# 더미 리소스 이미지 가이드

정적 더미 에셋 경로: `app/public/dummy-resource/` · URL 헬퍼: `dummyAsset()` (`app/src/lib/dummy-asset-path.ts`)

## 등장인물 썸네일 (`character-*.png`)

리소스 관리 **등장인물** 그리드 첫 행 = `character-1.png` ~ `character-4.png` (저장공간 UI에 바로 노출).

| 파일 | 용도 |
|------|------|
| `character-1.png` ~ `character-4.png` | 리소스 저장공간 그리드 1~4열 · `mockData` char-1~4 |
| `character-5.png` ~ `character-9.png` | 등장인물5~9 더미 |

클라이언트 업로드 압축(`image-upload-compress.ts`)과 맞춘 **정적 에셋 기준**:

| 항목 | 값 |
|------|-----|
| 긴 변 상한 | **960px** (`IMAGE_CROP_OUTPUT_MAX_EDGE_PX`) |
| 포맷 | **PNG** (코드 참조 확장자 유지) |
| 파일 크기 목표 | **≤ 220KB** (초과 시 PNG quality 단계 하향) |
| 재인코딩 | EXIF 회전 보정 후 리사이즈 |

### 일괄 최적화

```bash
cd app
node scripts/optimize-dummy-character-images.mjs \
  <원본> public/dummy-resource/character-4.png \
  ...
```

새 원본 교체 시 위 스크립트로 덮어쓴다. JPEG 원본도 입력 가능.

## 갤러리 썸네일 (`gallery-G3.png` ~ `gallery-G11.png`)

리소스 관리 **갤러리** 섹션 · `resourceMockData` `GALLERY_IMAGE_PATHS` · 9:16 세로.

| 파일 | 원본(예) |
|------|----------|
| `gallery-G3.png` | EventSoulCatcherYuruiCream |
| `gallery-G4.png` | EventSoulCatcherCat |
| `gallery-G5.png` | EventSoulCatcherYuruiTV |
| `gallery-G6.png` | EventSoulCatcherMeilingCream |
| `gallery-G7.png` | EventSoulCatcherSenaReveal |
| `gallery-G8.png` | EventSoulCatcherMeilingMilk |
| `gallery-G9.png` | EventSoulCatcherKizuneCream |
| `gallery-G10.png` | EventSoulCatcherMeilingFinger |
| `gallery-G11.png` | EventSoulCatcherSenaCream |

등장인물과 동일 압축 기준(`optimize-dummy-character-images.mjs`) 적용. 코드 경로·파일명은 유지하고 PNG만 교체한다.
