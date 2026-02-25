/**
 * Mock Data for Ink Editor
 * 2화: 내 여동생은 밖이나 안이나 위험하다
 */

import type { ScriptBlock, EpisodeBlock, SceneMarker, ChoiceBlock } from "./types";
import { createScriptBlock, createSceneMarker } from "./utils";

/**
 * 초기 에피소드 블록 리스트 (Scene + Script)
 */
export const INITIAL_BLOCKS: EpisodeBlock[] = [
  // SCENE 1 - 아침, 학교 복도
  createSceneMarker(1, "아침, 학교 복도"),
  
  // 지문: 햇살이 아늑한 학교 복도
  (() => {
    const block = createScriptBlock(
      "햇살이 아늑한 학교 복도. 친구들의 웃음소리가 가득하다.",
      "description"
    );
    return block;
  })(),
  
  // 독백: 언제부터였을까
  (() => {
    const block = createScriptBlock(
      "언제부터였을까. 등교하자마자 유나를 찾는 게 습관이 된 것은. 어제 나에게 소리치던 얼굴, 밤에 봤던 도발적인 모습, 그리고 아침에 스쳤던 부드러운 감촉까지… 머릿속이 온통 그 애로 가득하다.",
      "description"
    );
    block.attributes = {
      characterId: "char_001", // 덕훈
      backgroundId: null,
      bgmId: null,
      effectId: null,
      emotion: null,
    };
    return block;
  })(),
  
  // 지문: 저만치 고현우와 이야기하며
  (() => {
    const block = createScriptBlock(
      "저만치 고현우와 이야기하며 살짝 웃고 있는 유나를 발견했다.",
      "description"
    );
    return block;
  })(),
  
  // 독백: 또 저 녀석이랑 있네
  (() => {
    const block = createScriptBlock(
      "…또 저 녀석이랑 있네. 고현우. 쿨하고 인기 많은 녀석. 유나를 좋아한다는 소문이 있던데… 왜 저렇게 쉽게 웃어주는 거지? 나한테는 늘 가시를 세우면서.",
      "description"
    );
    block.attributes = {
      characterId: "char_001", // 덕훈
      backgroundId: null,
      bgmId: null,
      effectId: null,
      emotion: null,
    };
    return block;
  })(),
  
  // 지문: 나는 일부러 유나와 현우에게 다가갔다
  (() => {
    const block = createScriptBlock(
      "나는 일부러 유나와 현우에게 다가갔다.",
      "description"
    );
    return block;
  })(),
  
  // 대사: 둘이 아침부터 사이좋네
  (() => {
    const block = createScriptBlock(
      "둘이 아침부터 사이좋네.",
      "dialogue"
    );
    block.attributes = {
      characterId: "char_001", // 덕훈
      backgroundId: null,
      bgmId: null,
      effectId: null,
      emotion: null,
    };
    return block;
  })(),
  
  // 대사: 네가 무슨 상관이야
  (() => {
    const block = createScriptBlock(
      "(흠칫 놀라며) …네가 무슨 상관이야. (순식간에 표정이 굳는다.)",
      "dialogue"
    );
    block.attributes = {
      characterId: "char_002", // 유나
      backgroundId: null,
      bgmId: null,
      effectId: null,
      emotion: null,
    };
    return block;
  })(),
  
  // 대사: 어, 덕훈이 왔냐
  (() => {
    const block = createScriptBlock(
      "어, 덕훈이 왔냐. 유나가 어제 연극부 연습 때문에 피곤해 보여서 얘기좀 하고 있었어. 넌 유나랑 같이 살면서 챙겨주지도 않냐?",
      "dialogue"
    );
    block.attributes = {
      characterId: "char_003", // 고현우
      backgroundId: null,
      bgmId: null,
      effectId: null,
      emotion: null,
    };
    return block;
  })(),
  
  // 대사: 내가 왜
  (() => {
    const block = createScriptBlock(
      "…내가 왜.",
      "dialogue"
    );
    block.attributes = {
      characterId: "char_001", // 덕훈
      backgroundId: null,
      bgmId: null,
      effectId: null,
      emotion: null,
    };
    return block;
  })(),
  
  // 대사: 현우오빠, 그런 말 하지 마
  (() => {
    const block = createScriptBlock(
      "(고개를 숙이며) 현우오빠, 그런 말 하지 마",
      "dialogue"
    );
    block.attributes = {
      characterId: "char_002", // 유나
      backgroundId: null,
      bgmId: null,
      effectId: null,
      emotion: null,
    };
    return block;
  })(),
  
  // 대사: 하하, 알았어
  (() => {
    const block = createScriptBlock(
      "하하, 알았어. 근데 유나, 넌 무표정일 때랑 웃을 때랑 완전 다른 사람 같아. 그게 네 매력인가?",
      "dialogue"
    );
    block.attributes = {
      characterId: "char_003", // 고현우
      backgroundId: null,
      bgmId: null,
      effectId: null,
      emotion: null,
    };
    return block;
  })(),
  
  // 대사: 뭐, 뭐래!
  (() => {
    const block = createScriptBlock(
      "뭐, 뭐래! (얼굴이 살짝 붉어진다.)",
      "dialogue"
    );
    block.attributes = {
      characterId: "char_002", // 유나
      backgroundId: null,
      bgmId: null,
      effectId: null,
      emotion: null,
    };
    return block;
  })(),
  
  // 독백: 저 자식의 시답잖은 칭찬에는
  (() => {
    const block = createScriptBlock(
      "저 자식의 시답잖은 칭찬에는 얼굴을 붉힌다. 내 말은 전부 무시하면서. 속에서 짜증이 치밀어 오른다. 이건… 질투인가?",
      "description"
    );
    block.attributes = {
      characterId: "char_001", // 덕훈
      backgroundId: null,
      bgmId: null,
      effectId: null,
      emotion: null,
    };
    block.choices = [
      {
        id: "choice_scene1_1",
        content: "야, 고현우. 아침부터 작업 거냐? 보기 안 좋다.",
        nextSceneId: "Scene_2",
        isPaid: false,
        isAI: false,
      },
      {
        id: "choice_scene1_2",
        content: "유나, 너 어제 밤에 뭐 했던거야?",
        nextSceneId: "Scene_2",
        isPaid: false,
        isAI: false,
      },
      {
        id: "choice_scene1_3",
        content: "(아무렇지 않은 척한다) 난 목말라서 매점 좀 다녀온다.",
        nextSceneId: "Scene_2",
        isPaid: false,
        isAI: false,
      },
    ];
    return block;
  })(),
  
  // SCENE 2 - 학교 뒤뜰
  createSceneMarker(2, "학교 뒤뜰 (비밀의 한 조각)"),
  
  // 지문: 점심시간, 학교 뒤뜰의 낡은 벤치
  (() => {
    const block = createScriptBlock(
      "점심시간, 학교 뒤뜰의 낡은 벤치",
      "description"
    );
    return block;
  })(),
  
  // 독백: 밤에는 그렇게 거칠게
  (() => {
    const block = createScriptBlock(
      "밤에는 그렇게 거칠게 돌변하는 애가, 낮에는 왜 저렇게까지 조용한 걸까. 분명 뭔가 단서가 있을 거다. 밤의 유나와 낮의 유나를 연결할 결정적인 조각이. 좋아, 명탐정 덕훈, 오늘에야말로 그 비밀을 파헤쳐 주겠어!",
      "description"
    );
    block.attributes = {
      characterId: "char_001", // 덕훈
      backgroundId: null,
      bgmId: null,
      effectId: null,
      emotion: null,
    };
    return block;
  })(),
  
  // 지문: 탐정처럼 숨어서 유나를 지켜보던 나는
  (() => {
    const block = createScriptBlock(
      "탐정처럼 숨어서 유나를 지켜보던 나는. 바로 그때, 유나가 주머니에서 검고 가느다란 펜슬 같은 것을 꺼내 입술로 가져가는 것을 보았다. 멀리서 보기엔 영락없는 담배의 모습 같았다.",
      "description"
    );
    return block;
  })(),
  
  // 독백: 저, 저건… 담배?
  (() => {
    const block = createScriptBlock(
      "저, 저건… 담배? 아니, 잠깐만. 내가 찾던 비밀은 저런 탈선의 현장이 아닌데…? 뭐지? 코믹 탐정물 찍는 줄 알았는데, 갑자기 장르가 사회고발물로 바뀐 이 기분은?!",
      "description"
    );
    block.attributes = {
      characterId: "char_001", // 덕훈
      backgroundId: null,
      bgmId: null,
      effectId: null,
      emotion: null,
    };
    return block;
  })(),
  
  // 지문: 내가 혼란에 빠진 사이
  (() => {
    const block = createScriptBlock(
      "내가 혼란에 빠진 사이, 유나가 손거울을 보며 펜슬로 입술선을 그리고 있다. 거친 인상을 만들고 싶은지, 입꼬리를 날카롭게 그리려 애쓰며 중얼거린다.",
      "description"
    );
    return block;
  })(),
  
  // 대사: 크흠!!.. 여기에 발을 들인 순간
  (() => {
    const block = createScriptBlock(
      "크흠!!.. 여기에 발을 들인 순간, 너희는 이미 내 소유물이야. 기어오를 생각은 버려. 내가 부르면 언제든 달려올 준비나 해. 알겠어? 대답은 '네, 주인님' 하나면 충분해.",
      "dialogue"
    );
    block.attributes = {
      characterId: "char_002", // 유나
      backgroundId: null,
      bgmId: null,
      effectId: null,
      emotion: null,
    };
    return block;
  })(),
  
  // 독백: 저 한심한 연기는 둘째치고
  (() => {
    const block = createScriptBlock(
      "저 한심한 연기는 둘째치고, 일단 저 위험한 물건부터 압수해야겠다!",
      "description"
    );
    block.attributes = {
      characterId: "char_001", // 덕훈
      backgroundId: null,
      bgmId: null,
      effectId: null,
      emotion: null,
    };
    return block;
  })(),
  
  // 상황 설명: 덕훈이 정의의 사도처럼
  (() => {
    const block = createScriptBlock(
      "(상황 설명) 덕훈이 정의의 사도처럼 수풀 뒤에서 뛰쳐나온다.",
      "description"
    );
    return block;
  })(),
  
  // 대사: 현장 체포다, 이 녀석!
  (() => {
    const block = createScriptBlock(
      "현장 체포다, 이 녀석!",
      "dialogue"
    );
    block.attributes = {
      characterId: "char_001", // 덕훈
      backgroundId: null,
      bgmId: null,
      effectId: null,
      emotion: null,
    };
    return block;
  })(),
  
  // 상황 설명: 너무 놀란 유나가
  (() => {
    const block = createScriptBlock(
      "(상황 설명) 너무 놀란 유나가 실수로 펜슬을 떨어뜨린다. 덕훈이 재빨리 그것을 주워 들고 비장하게 외친다.",
      "description"
    );
    return block;
  })(),
  
  // 대사: 이런 건 몸에 안 좋아!
  (() => {
    const block = createScriptBlock(
      "이런 건 몸에 안 좋아! 대체 언제부터… 뭐야, 이거 연필이야?",
      "dialogue"
    );
    block.attributes = {
      characterId: "char_001", // 덕훈
      backgroundId: null,
      bgmId: null,
      effectId: null,
      emotion: null,
    };
    return block;
  })(),
  
  // 상황 설명: 덕훈의 손에 들려 있는 것은
  (() => {
    const block = createScriptBlock(
      "(상황 설명) 덕훈의 손에 들려 있는 것은 그냥 평범한 화장품, 검은색 립 라이너 펜슬이다. 유나의 얼굴이 터질 것처럼 새빨개진다.",
      "description"
    );
    return block;
  })(),
  
  // 대사: 뭐, 뭐야!
  (() => {
    const block = createScriptBlock(
      "뭐, 뭐야! 남의 화장품을 왜 함부로 만져! 이건… 미술 시간 숙제거든! 인물화!",
      "dialogue"
    );
    block.attributes = {
      characterId: "char_002", // 유나
      backgroundId: null,
      bgmId: null,
      effectId: null,
      emotion: null,
    };
    return block;
  })(),
  
  // 대사: 네 입술에다 인물화를 그린다고?
  (() => {
    const block = createScriptBlock(
      "(어이없다는 듯) 네 입술에다 인물화를 그린다고?",
      "dialogue"
    );
    block.attributes = {
      characterId: "char_001", // 덕훈
      backgroundId: null,
      bgmId: null,
      effectId: null,
      emotion: null,
    };
    return block;
  })(),
  
  // 대사: 시, 시끄러!
  (() => {
    const block = createScriptBlock(
      "시, 시끄러! 아무튼 내놔!",
      "dialogue"
    );
    block.attributes = {
      characterId: "char_002", // 유나
      backgroundId: null,
      bgmId: null,
      effectId: null,
      emotion: null,
    };
    return block;
  })(),
  
  // 상황 설명: 유나는 덕훈의 손에서
  (() => {
    const block = createScriptBlock(
      "(상황 설명) 유나는 덕훈의 손에서 립 라이너를 낚아채듯 뺏어서는, 울상이 되어 빛의 속도로 도망친다.",
      "description"
    );
    return block;
  })(),
  
  // 독백: 혼자 덩그러니 남아
  (() => {
    const block = createScriptBlock(
      "(혼자 덩그러니 남아 어리둥절해한다) …하아. 미술 숙제? 방금 그건 뭔가 연습 하는 것 같았는데. 비밀을 캐러 왔다가 더 큰 혼란만 얻었다. 대체 저 녀석, 화장까지 해가면서 뭐가 되려는 거지?",
      "description"
    );
    block.attributes = {
      characterId: "char_001", // 덕훈
      backgroundId: null,
      bgmId: null,
      effectId: null,
      emotion: null,
    };
    return block;
  })(),
  
  // SCENE 3 - 귀갓길
  createSceneMarker(3, "귀갓길 (겹쳐지는 그림자, 미묘한 거리)"),
  
  // 지문: 나는 몇 걸음 앞에서
  (() => {
    const block = createScriptBlock(
      "나는 몇 걸음 앞에서 터덜터덜 걷고 있는 유나의 뒷모습을 보고 있었다. 오늘 아침, 그 사건 이후로 유나는 나를 완벽하게 없는 사람 취급했다. 복도 끝에서 마주치면 옆 교실로 쏙 들어가 버리고, 점심시간에는 코빼기도 보이지 않았다. 홧김에 고현우 녀석과 어울려 다니는 것 같기도 했다. …아침의 그 일이 그렇게나 싫었나? 사과라도 해야 하나? 아니, 대체 뭘. 온갖 생각이 머릿속을 헤집는 사이, 오기가 생겼다.",
      "description"
    );
    return block;
  })(),
  
  // 대사: 야, 유령
  (() => {
    const block = createScriptBlock(
      "야, 유령.",
      "dialogue"
    );
    block.attributes = {
      characterId: "char_001", // 덕훈
      backgroundId: null,
      bgmId: null,
      effectId: null,
      emotion: null,
    };
    return block;
  })(),
  
  // 대사: 뭐?
  (() => {
    const block = createScriptBlock(
      "(화들짝 놀라며) …뭐?",
      "dialogue"
    );
    block.attributes = {
      characterId: "char_002", // 유나
      backgroundId: null,
      bgmId: null,
      effectId: null,
      emotion: null,
    };
    return block;
  })(),
  
  // 대사: 하루 종일 그렇게 쏙쏙 피하는데
  (() => {
    const block = createScriptBlock(
      "하루 종일 그렇게 쏙쏙 피하는데 유령 아니면 뭐냐. 봐봐, 너 그림자만 길게 늘어져서 혼자 걸어가니까 진짜 귀신 같잖아.",
      "dialogue"
    );
    block.attributes = {
      characterId: "char_001", // 덕훈
      backgroundId: null,
      bgmId: null,
      effectId: null,
      emotion: null,
    };
    return block;
  })(),
  
  // 지문: 내 말에 유나의 발걸음이
  (() => {
    const block = createScriptBlock(
      "내 말에 유나의 발걸음이 미세하게 느려졌다. 녀석의 시선이 잠시 땅에 깔린 자신의 길고 외로운 그림자에 머무는 것을 보았다. 그 순간, 문득 짓궂은 장난기가 발동했다. 자꾸만 거리를 두려는 녀석의 그림자라도 붙잡아두고 싶었던 걸까.",
      "description"
    );
    return block;
  })(),
  
  // 지문: 나는 성큼 걸음을 옮겨
  (() => {
    const block = createScriptBlock(
      "나는 성큼 걸음을 옮겨 나의 그림자를 유나의 그림자 위에 정확히 겹쳐버린다. 마치 나의 큰 그림자가 유나의 가느다란 그림자를 뒤에서 끌어안는 듯한 모양새가 된다.",
      "description"
    );
    return block;
  })(),
  
  // 대사: 이러면 혼자 가는 것 같진 않잖아
  (() => {
    const block = createScriptBlock(
      "(태연한 척 딴청을 피우며) 이러면 혼자 가는 것 같진 않잖아.",
      "dialogue"
    );
    block.attributes = {
      characterId: "char_001", // 덕훈
      backgroundId: null,
      bgmId: null,
      effectId: null,
      emotion: null,
    };
    return block;
  })(),
  
  // 대사: …!
  (() => {
    const block = createScriptBlock(
      "(놀라서 눈이 동그래진 채, 자기 발밑의 겹쳐진 그림자와 내 얼굴을 번갈아 쳐다본다.) …!",
      "dialogue"
    );
    block.attributes = {
      characterId: "char_002", // 유나
      backgroundId: null,
      bgmId: null,
      effectId: null,
      emotion: null,
    };
    return block;
  })(),
  
  // 독백: 대답 대신
  (() => {
    const block = createScriptBlock(
      "대답 대신, 노을빛에 유나의 귀가 새빨갛게 물드는 것을 나는 똑똑히 보았다.",
      "description"
    );
    block.attributes = {
      characterId: "char_001", // 덕훈
      backgroundId: null,
      bgmId: null,
      effectId: null,
      emotion: null,
    };
    block.choices = [
      {
        id: "choice_scene3_1",
        content: "혼자 가는 길, 심심하잖아. 같이 가주려고 그런다.",
        nextSceneId: "Scene_4",
        isPaid: false,
        isAI: false,
      },
      {
        id: "choice_scene3_2",
        content: "사실은 내가 무서워서 그래. 네 뒤에 숨어 가려고.",
        nextSceneId: "Scene_4",
        isPaid: false,
        isAI: false,
      },
      {
        id: "choice_scene3_3",
        content: "(묵묵히 옆에서 걷는다)",
        nextSceneId: "Scene_4",
        isPaid: false,
        isAI: false,
      },
    ];
    return block;
  })(),
  
  // SCENE 4 - 덕훈의 방
  createSceneMarker(4, "덕훈의 방 (미나의 기습, 새로운 파문)"),
  
  // 지문: 유나의 집에서 저녁 식사 후
  (() => {
    const block = createScriptBlock(
      "유나의 집에서 저녁 식사 후, 나는 우리 집 내 방으로 왔다. 미나가 자연스럽게 덕훈의 침대에 대자로 뻗어있다.",
      "description"
    );
    return block;
  })(),
  
  // 독백: 이 녀석은 정말
  (() => {
    const block = createScriptBlock(
      "이 녀석은 정말… 자기 집보다 우리집을 더 좋아하는 것 같다. 유나와는 정반대로, 거리감이라는 게 전혀 없다.",
      "description"
    );
    block.attributes = {
      characterId: "char_001", // 덕훈
      backgroundId: null,
      bgmId: null,
      effectId: null,
      emotion: null,
    };
    return block;
  })(),
  
  // 대사: 야, 또 남의 침대야
  (() => {
    const block = createScriptBlock(
      "야, 또 남의 침대야. 내려와.",
      "dialogue"
    );
    block.attributes = {
      characterId: "char_001", // 덕훈
      backgroundId: null,
      bgmId: null,
      effectId: null,
      emotion: null,
    };
    return block;
  })(),
  
  // 대사: 싫은데~
  (() => {
    const block = createScriptBlock(
      "싫은데~ 오빠 침대가 더 푹신하단 말이야. 근데 오빠, 오늘 언니랑 같이 들어왔다며?",
      "dialogue"
    );
    block.attributes = {
      characterId: "char_004", // 미나
      backgroundId: null,
      bgmId: null,
      effectId: null,
      emotion: null,
    };
    return block;
  })(),
  
  // 대사: 어쩌다 보니
  (() => {
    const block = createScriptBlock(
      "어쩌다 보니.",
      "dialogue"
    );
    block.attributes = {
      characterId: "char_001", // 덕훈
      backgroundId: null,
      bgmId: null,
      effectId: null,
      emotion: null,
    };
    return block;
  })(),
  
  // 대사: 흐음~?
  (() => {
    const block = createScriptBlock(
      "흐음~? 어제 거실에서 '꽈당' 한 이후로 뭔가 핑크빛 기류라도 흐르는 거야?",
      "dialogue"
    );
    block.attributes = {
      characterId: "char_004", // 미나
      backgroundId: null,
      bgmId: null,
      effectId: null,
      emotion: null,
    };
    return block;
  })(),
  
  // 대사: 너, 봤었냐?
  (() => {
    const block = createScriptBlock(
      "…너, 봤었냐?",
      "dialogue"
    );
    block.attributes = {
      characterId: "char_001", // 덕훈
      backgroundId: null,
      bgmId: null,
      effectId: null,
      emotion: null,
    };
    return block;
  })(),
  
  // 대사: 당연하지!
  (() => {
    const block = createScriptBlock(
      "(눈을 동그랗게 뜨며) 당연하지! 완전 로맨스 영화 한 편 찍는 줄 알았잖아. 언니 얼굴 터지는 줄~",
      "dialogue"
    );
    block.attributes = {
      characterId: "char_004", // 미나
      backgroundId: null,
      bgmId: null,
      effectId: null,
      emotion: null,
    };
    return block;
  })(),
  
  // 독백: 망했다
  (() => {
    const block = createScriptBlock(
      "망했다. 하필이면 제일 짓궂은 녀석에게 들켰다.",
      "description"
    );
    block.attributes = {
      characterId: "char_001", // 덕훈
      backgroundId: null,
      bgmId: null,
      effectId: null,
      emotion: null,
    };
    return block;
  })(),
  
  // 지문: 미나는 그대로 벌떡 일어나
  (() => {
    const block = createScriptBlock(
      "미나는 그대로 벌떡 일어나 앉더니 나의 얼굴 앞으로 쑥 다가왔다.",
      "description"
    );
    return block;
  })(),
  
  // 대사: 근데 오빠
  (() => {
    const block = createScriptBlock(
      "근데 오빠.",
      "dialogue"
    );
    block.attributes = {
      characterId: "char_004", // 미나
      backgroundId: null,
      bgmId: null,
      effectId: null,
      emotion: null,
    };
    return block;
  })(),
  
  // 대사: 왜
  (() => {
    const block = createScriptBlock(
      "…왜.",
      "dialogue"
    );
    block.attributes = {
      characterId: "char_001", // 덕훈
      backgroundId: null,
      bgmId: null,
      effectId: null,
      emotion: null,
    };
    return block;
  })(),
  
  // 대사: 언니한테만 그렇게 서비스해 주기야?
  (() => {
    const block = createScriptBlock(
      "(귓가에 속삭이며) 언니한테만 그렇게 서비스해 주기야? 나는? 나도 '꽈당' 하면 오빠가 잡아줄 거야?",
      "dialogue"
    );
    block.attributes = {
      characterId: "char_004", // 미나
      backgroundId: null,
      bgmId: null,
      effectId: null,
      emotion: null,
    };
    block.choices = [
      {
        id: "choice_scene4_1",
        content: "장난치지 마라. 넌 아직 애야.",
        nextSceneId: "Scene_5",
        isPaid: false,
        isAI: false,
      },
      {
        id: "choice_scene4_2",
        content: "그래, 너도 넘어지면 똑같이 해줄게. 대신 업어주기까지 할까?",
        nextSceneId: "Scene_5",
        isPaid: false,
        isAI: false,
      },
      {
        id: "choice_scene4_3",
        content: "시끄럽고 불 좀 꺼주고 나가라.",
        nextSceneId: "Scene_5",
        isPaid: false,
        isAI: false,
      },
    ];
    return block;
  })(),
  
  // SCENE 5 - 다음화 예고
  createSceneMarker(5, "다음화 예고"),
  
  // 지문: 늦은 밤, 거실
  (() => {
    const block = createScriptBlock(
      "늦은 밤, 거실. 스탠드 불빛 아래 소파에 앉아있는 설인화.",
      "description"
    );
    return block;
  })(),
  
  // 독백: 목이 말라 나왔는데
  (() => {
    const block = createScriptBlock(
      "목이 말라 나왔는데… 아줌마는 잠도 안 자고 뭘 하는 거지.",
      "description"
    );
    block.attributes = {
      characterId: "char_001", // 덕훈
      backgroundId: null,
      bgmId: null,
      effectId: null,
      emotion: null,
    };
    return block;
  })(),
  
  // 지문: 덕훈의 시선 끝에
  (() => {
    const block = createScriptBlock(
      "덕훈의 시선 끝에, 설인화가 손에 쥔 낡은 사진 한 장을 보고 있는 모습이 들어온다. 그 표정이 어딘지 슬퍼 보인다.",
      "description"
    );
    return block;
  })(),
  
  // 대사: 아줌마
  (() => {
    const block = createScriptBlock(
      "아줌마.",
      "dialogue"
    );
    block.attributes = {
      characterId: "char_001", // 덕훈
      backgroundId: null,
      bgmId: null,
      effectId: null,
      emotion: null,
    };
    return block;
  })(),
  
  // 대사: 어, 덕훈아
  (() => {
    const block = createScriptBlock(
      "(화들짝 놀라며 사진을 등 뒤로 감춘다) 어, 덕훈아. 깼어? 그냥… 잠이 안 와서.",
      "dialogue"
    );
    block.attributes = {
      characterId: "char_005", // 설인화
      backgroundId: null,
      bgmId: null,
      effectId: null,
      emotion: null,
    };
    return block;
  })(),
  
  // 대사: 넌 아빠 안 보고 싶니?
  (() => {
    const block = createScriptBlock(
      "(애써 미소 지으며) …넌 아빠 안 보고 싶니?",
      "dialogue"
    );
    block.attributes = {
      characterId: "char_005", // 설인화
      backgroundId: null,
      bgmId: null,
      effectId: null,
      emotion: null,
    };
    return block;
  })(),
  
  // 독백: 갑자기 아버지 이야기는 왜
  (() => {
    const block = createScriptBlock(
      "갑자기 아버지 이야기는 왜. 나를 보는 것도, 내 뒤의 누군가를 보는 것도 아닌 그 낯선 눈빛. 이상하게 심장이 내려앉는다.",
      "description"
    );
    block.attributes = {
      characterId: "char_001", // 덕훈
      backgroundId: null,
      bgmId: null,
      effectId: null,
      emotion: null,
    };
    return block;
  })(),
  
  // 지문: 설인화는 대답을 기다리지 않고
  (() => {
    const block = createScriptBlock(
      "설인화는 대답을 기다리지 않고 자리에서 일어나 방으로 들어간다. 홀로 남은 덕훈은 그녀가 앉아있던 빈자리를 한동안 응시한다.",
      "description"
    );
    return block;
  })(),
  
  // 독백: 그날 밤
  (() => {
    const block = createScriptBlock(
      "그날 밤, 아줌마의 질문은 가시처럼 마음에 박혔다. 그리고 며칠 뒤, 나는 보지 말아야 할 것을 보고 말았다. 낯선 남자 옆에서… 웃고 있는 아줌마를.",
      "description"
    );
    block.attributes = {
      characterId: "char_001", // 덕훈
      backgroundId: null,
      bgmId: null,
      effectId: null,
      emotion: null,
    };
    return block;
  })(),
];

/**
 * 초기 스크립트 블록 리스트 (하위 호환성)
 */
export const INITIAL_SCRIPT: ScriptBlock[] = INITIAL_BLOCKS.filter(
  (block) => block.type === "script"
) as ScriptBlock[];
