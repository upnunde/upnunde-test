"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { SidebarList } from "@/components/AppSidebar/SidebarList";
import { BgmListItem } from "./BgmListItem";

function parseDurationToSeconds(duration: string): number {
  const parts = duration.trim().split(":");
  if (parts.length >= 2) {
    const m = parseInt(parts[0], 10) || 0;
    const s = parseInt(parts[1], 10) || 0;
    return m * 60 + s;
  }
  return 0;
}

/** [정책 9] BGM 추가 시 노출되는 음악 목록 팝업. 미리듣기 후 추가 가능. */
export interface BgmListModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (trackId: string, title: string, duration: string) => void;
}

const GENRES = ["로맨스", "판타지", "모험", "신화", "마법", "전설"];

/** 3~5분(초) 랜덤 값을 "MM:SS" 형식으로 반환 */
function randomDuration3to5Min(): string {
  const totalSeconds = 180 + Math.floor(Math.random() * 121); // 180~300초 (3:00~5:00)
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

type MockTrack = { id: string; title: string; duration: string };

function makeTracks(genreKey: string, titles: string[]): MockTrack[] {
  return titles.map((title, i) => ({
    id: `${genreKey}-t${i + 1}`,
    title,
    duration: randomDuration3to5Min(),
  }));
}

/** 장르별 테마에 맞는 더미 트랙 목록 (15~30개) */
const MOCK_TRACKS_BY_GENRE: Record<string, MockTrack[]> = {
  로맨스: makeTracks("romance", [
    "달빛 아래 첫 키스",
    "영원한 사랑의 멜로디",
    "설렘 가득한 오후",
    "이별의 비가 내리던 날",
    "첫사랑 기억",
    "로맨틱 세레나데",
    "그대와 영원히",
    "사랑의 왈츠",
    "그리움의 편지",
    "두 번째 만남",
    "눈물의 하늘",
    "약속",
    "달콤한 꿈",
    "겨울 연가",
    "봄날의 첫눈",
    "그날 밤 별빛",
    "당신만을",
    "이별 후에",
    "다시 만난 날",
    "영원한 밤",
  ]),
  판타지: makeTracks("fantasy", [
    "드래곤의 둥지",
    "요정의 숲 속으로",
    "마법의 검",
    "잊혀진 왕국",
    "수정 동굴의 비밀",
    "날개 달린 말",
    "엘프의 노래",
    "유니콘의 숲",
    "고대 드래곤의 비밀",
    "마법 학교 대강당",
    "다크 엘프의 성",
    "불의 산",
    "얼음 성채",
    "황금 숲",
    "그림자 계곡",
    "빛의 탑",
    "용기의 시험",
    "요정왕의 축제",
    "마법 망토",
    "시간의 방",
  ]),
  모험: makeTracks("adventure", [
    "보물을 찾아서",
    "정글 탐험",
    "바다 위 항해",
    "산맥 넘어 저편",
    "미지의 섬",
    "동굴 속 비밀",
    "지도에 없는 길",
    "사막 횡단",
    "북극의 밤",
    "밀림 속 오아시스",
    "폭포 뒤 동굴",
    "낙타 행렬",
    "등대의 불",
    "고래와 함께",
    "산 정상에서",
    "협곡 건너기",
    "숨겨진 유적",
    "폐허의 도시",
    "해적선 출항",
    "열기구 여행",
  ]),
  신화: makeTracks("myth", [
    "올림포스의 신들",
    "프로메테우스의 불",
    "영웅 헤라클레스",
    "페르세우스의 여정",
    "판도라의 상자",
    "아틀라스의 짐",
    "오딧세이아",
    "아폴론의 수레",
    "아테나의 지혜",
    "포세이돈의 분노",
    "제우스의 번개",
    "아르테미스의 숲",
    "아프로디테의 정원",
    "아레스의 전장",
    "헤파이스토스의 대장간",
    "헤르메스의 날개",
    "데메테르의 밀밭",
    "하데스의 문",
    "이카로스의 날개",
    "트로이의 목마",
  ]),
  마법: makeTracks("magic", [
    "마법사의 탑",
    "주문이 깃든 책",
    "비밀의 숲",
    "크리스탈 볼",
    "달빛 마법",
    "포션 제작실",
    "마법 학교로 가는 길",
    "변신의 순간",
    "빗자루 타고",
    "마법 랜턴",
    "얼음 주문",
    "불꽃 마법",
    "치유의 빛",
    "저주 해제",
    "예언의 방",
    "마법 동물원",
    "지하 서고",
    "별의 정원",
    "시간 되돌리기",
    "이상한 나라의 문",
  ]),
  전설: makeTracks("legend", [
    "영웅의 귀환",
    "고대 왕국의 예언",
    "전설의 검 아론다이트",
    "불멸의 이야기",
    "왕좌의 계보",
    "드래곤 슬레이어",
    "세기의 전설",
    "왕국의 새벽",
    "검은 기사의 맹세",
    "성배를 찾아서",
    "원탁의 기사들",
    "마녀의 숲",
    "용의 계약",
    "왕관의 무게",
    "최후의 전투",
    "부활의 땅",
    "예언된 자",
    "잊힌 서사시",
    "대서사시",
    "영광의 순간",
  ]),
};

/** ID로 트랙 조회용 (모든 장르 통합) */
const ALL_MOCK_TRACKS = Object.values(MOCK_TRACKS_BY_GENRE).flat();

const MAX_SELECTED = 10;

type PlayingSource = "list" | "selected";

export function BgmListModal({ open, onClose, onAdd }: BgmListModalProps) {
  const [playingId, setPlayingId] = useState<string | null>(null);
  /** 재생을 시작한 목록. 플레이 중 상태는 이 목록에서만 1개 표시 */
  const [playingSource, setPlayingSource] = useState<PlayingSource | null>(null);
  const [activeGenre, setActiveGenre] = useState<string>(GENRES[1] ?? GENRES[0]); // 기본: 판타지
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(0);

  const listTracks = MOCK_TRACKS_BY_GENRE[activeGenre] ?? [];
  const playingTrack = ALL_MOCK_TRACKS.find((t) => t.id === playingId) ?? null;
  const playingTotalSeconds = playingTrack
    ? parseDurationToSeconds(playingTrack.duration)
    : 0;

  const handlePlayFromList = (id: string) => {
    const isTogglingOff = playingId === id;
    setPlayingId((prev) => (prev === id ? null : id));
    setPlayingSource(isTogglingOff ? null : "list");
    setCurrentTimeSec(0);
    // TODO: 실제 오디오 재생 연동
  };

  const handlePlayFromSelected = (id: string) => {
    const isTogglingOff = playingId === id;
    setPlayingId((prev) => (prev === id ? null : id));
    setPlayingSource(isTogglingOff ? null : "selected");
    setCurrentTimeSec(0);
    // TODO: 실제 오디오 재생 연동
  };

  const handlePause = () => {
    setPlayingId(null);
    setPlayingSource(null);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((v) => v !== id);
      }
      if (prev.length >= MAX_SELECTED) return prev;
      return [...prev, id];
    });
  };

  const handleSave = () => {
    const selectedTracks = ALL_MOCK_TRACKS.filter((t) => selectedIds.includes(t.id));
    selectedTracks.forEach((track) => {
      onAdd(track.id, track.title, track.duration);
    });
    onClose();
  };

  const selectedTracks = ALL_MOCK_TRACKS.filter((t) => selectedIds.includes(t.id));

  useEffect(() => {
    if (!playingId || !playingTrack || !playingTotalSeconds) {
      return;
    }

    const interval = window.setInterval(() => {
      setCurrentTimeSec((prev) => {
        const next = prev + 1;
        if (next >= playingTotalSeconds) {
          window.clearInterval(interval);
          return playingTotalSeconds;
        }
        return next;
      });
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [playingId, playingTrack, playingTotalSeconds]);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="w-[800px] max-w-[calc(100vw-2rem)] gap-0 bg-surface-10 rounded-2xl border border-border-10 p-0 overflow-hidden">
        <DialogHeader className="justify-center items-center h-10 px-5 pt-1 pb-0 border-b border-border-10">
          <div className="flex items-center justify-center gap-1">
            <DialogTitle className="text-on-surface-10 text-base font-bold font-['Pretendard_JP']">
              BGM
            </DialogTitle>
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-surface-20">
              <Info className="w-3 h-3 text-on-surface-30" aria-hidden />
            </span>
          </div>
        </DialogHeader>

        <div className="flex h-[400px]">
          {/* 장르 목록 */}
          <div className="w-[160px] border-r border-border-10 bg-surface-10 px-5 py-4 flex flex-col gap-3">
            <div className="text-xs font-medium text-on-surface-30">장르</div>
            <SidebarList
              items={GENRES.map((g) => ({ id: g, label: g }))}
              activeId={activeGenre}
              onSelect={setActiveGenre}
              listClassName="flex flex-col gap-1"
              itemWrapperClassName="-ml-3 flex h-8 items-center justify-start pl-0 pr-0 rounded-md"
              itemClassName="flex h-8 w-full items-center justify-start text-left text-sm rounded-md px-3 py-1.5 transition-colors"
              itemActiveClassName="text-primary font-medium"
              itemInactiveClassName="text-on-surface-30 hover:text-on-surface-10 hover:bg-surface-20"
            />
          </div>

          {/* 리스트 - 우측(선택한 음악)과 동일한 레이아웃 구조 */}
          <div className="flex-1 min-w-0 border-r border-border-10 px-2 py-4 flex flex-col gap-1">
            <div className="flex w-full items-center justify-between text-xs font-medium text-on-surface-30 px-4 mt-2">
              <span>리스트</span>
            </div>
            <div className="flex-1 flex flex-col gap-0 overflow-y-auto pr-1">
              {listTracks.map((track, idx) => {
                const isActiveHere = playingId === track.id && playingSource === "list";
                return (
                  <BgmListItem
                    key={track.id}
                    variant="selection"
                    item={track}
                    index={idx + 1}
                    isActive={isActiveHere}
                    isPlaying={isActiveHere}
                    currentTime={isActiveHere ? currentTimeSec : 0}
                    onPlay={() => handlePlayFromList(track.id)}
                    onPause={handlePause}
                    onSeek={isActiveHere ? setCurrentTimeSec : undefined}
                    showPlayButton
                    onAdd={() => toggleSelect(track.id)}
                    selected={selectedIds.includes(track.id)}
                    showProgressBar
                  />
                );
              })}
            </div>
          </div>

          {/* 선택한 음악 - 좌측(리스트)과 동일한 레이아웃 구조 */}
          <div className="flex-1 min-w-0 px-2 py-0 flex flex-col gap-0">
            <div className="flex w-full items-center justify-between text-xs font-medium text-on-surface-30 px-4">
              <span>선택한 음악</span>
              <span className="text-on-surface-20">
                <span className="text-on-surface-10">{selectedTracks.length}</span>
                <span className="text-on-surface-20"> / {MAX_SELECTED}</span>
              </span>
            </div>
            <div className="flex-1 flex flex-col gap-0 overflow-y-auto pr-1">
              {selectedTracks.map((track, idx) => {
                const isActiveHere = playingId === track.id && playingSource === "selected";
                return (
                  <BgmListItem
                    key={track.id}
                    variant="selection"
                    item={track}
                    index={idx + 1}
                    isActive={isActiveHere}
                    isPlaying={isActiveHere}
                    currentTime={isActiveHere ? currentTimeSec : 0}
                    onPlay={() => handlePlayFromSelected(track.id)}
                    onPause={handlePause}
                    onSeek={isActiveHere ? setCurrentTimeSec : undefined}
                    onDelete={(item) => toggleSelect(item.id)}
                    showProgressBar
                  />
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 px-6 py-4 border-t border-border-10 bg-surface-5">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="min-w-[80px] border-border-20 text-on-surface-30"
            >
              취소
            </Button>
          </DialogClose>
          <Button
            type="button"
            className="min-w-[80px]"
            disabled={selectedTracks.length === 0}
            onClick={handleSave}
          >
            추가하기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
