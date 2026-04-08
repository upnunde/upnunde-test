/**
 * Ink Editor Data Types
 * 리니어한 데이터 흐름을 가진 단일 배열 구조
 */

/**
 * 블록 타입 구분자
 */
export type BlockType = "scene" | "script";

/**
 * Scene Marker - 장면 구간 구분을 위한 이정표
 */
export interface SceneMarker {
  type: "scene";
  id: string;
  sceneNumber: number;
  title: string;
}

/**
 * Mapped Resources - 리소스 매핑 정보
 * 단일 슬롯 규칙: 카테고리당 딱 1개의 리소스만 허용
 * Key-Value 객체 구조로 중복을 구조적으로 방지
 */
export interface MappedResources {
  /**
   * 캐릭터 리소스 ID
   * null이면 리소스 미적용 상태
   */
  characterId?: string | null;

  /**
   * 배경 리소스 ID
   */
  backgroundId?: string | null;

  /**
   * 배경음악(BGM) 리소스 ID
   */
  bgmId?: string | null;

  /**
   * 이펙트 리소스 ID
   */
  effectId?: string | null;

  /**
   * AI 자동 매칭 메타데이터 (선택적)
   * AI가 자동으로 리소스를 매칭했을 때의 정보
   */
  aiMatchMetadata?: {
    /**
     * AI 매칭이 수행된 시각 (ISO 8601)
     */
    matchedAt?: string;

    /**
     * AI 매칭 신뢰도 (0.0 ~ 1.0)
     */
    confidence?: number;

    /**
     * AI 매칭에 사용된 모델 버전
     */
    modelVersion?: string;
  };
}

/**
 * Script Block Attributes - 블록 속성 (카테고리별 단일 슬롯)
 * 🔥 핵심: 카테고리 Key당 하나의 Value만 존재 (중복 원천 차단)
 * 배열이 아닌 Object(Map) 형태로 구조적으로 중복을 방지
 */
export interface ScriptBlockAttributes {
  /**
   * 캐릭터 리소스 ID
   * 한 블록에 캐릭터는 한 명만 가능
   */
  characterId?: string | null;

  /**
   * 배경 리소스 ID
   * 한 블록에 배경은 하나만 가능
   */
  backgroundId?: string | null;

  /**
   * 배경음악(BGM) 리소스 ID
   * 한 블록에 BGM은 하나만 가능
   */
  bgmId?: string | null;

  /**
   * 이펙트 리소스 ID
   * 한 블록에 이펙트는 하나만 가능
   */
  effectId?: string | null;

  /**
   * 감정 표현
   * 한 블록에 감정 표현은 하나만 가능
   */
  emotion?: string | null;
}

/**
 * Script Block - 실제 스크립트 블록
 */
export interface ScriptBlock {
  type: "script";
  id: string;

  /**
   * 블록 타입: 대사 또는 설명
   */
  blockType?: "dialogue" | "description";

  /**
   * 대사/설명 내용
   */
  content: string;

  /**
   * @deprecated `attributes`를 사용하세요
   * 매핑된 리소스 정보 (하위 호환성을 위해 유지)
   */
  mappedResources?: MappedResources;

  /**
   * 블록 속성 (카테고리별 단일 슬롯 규칙)
   * 🔥 핵심: 카테고리 Key당 하나의 Value만 존재 (중복 원천 차단)
   */
  attributes?: ScriptBlockAttributes;

  choices?: ChoiceBlock[];
}

/**
 * Choice Block - 선택지 블록
 */
export interface ChoiceBlock {
  id: string;
  content: string;
  nextSceneId?: string;
  isPaid?: boolean;
  isAI?: boolean;
}

/**
 * Episode Block - 단일 배열의 유니온 타입
 */
export type EpisodeBlock = SceneMarker | ScriptBlock;

/**
 * Episode Data - 전체 에피소드 데이터
 */
export interface EpisodeData {
  id: string;
  title: string;
  blocks: EpisodeBlock[]; // 리니어한 단일 배열
}
