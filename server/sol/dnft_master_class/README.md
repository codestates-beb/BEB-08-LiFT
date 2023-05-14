# Contract Addrss

## 0xA99bf8C6E7C172EEC060DcE07b2338fF2e5fa950

<!-- /*
이 SVG 코드는 500x500 크기의 SVG 캔버스를 생성하고, 여러 개의 원들을 생성하고 색상을 지정하는 코드입니다.

<svg> 요소는 SVG 캔버스를 정의하며, 너비, 높이, viewBox, preserveAspectRatio 속성을 지정합니다.

<g> 요소는 그룹을 생성하며, clip-path 속성을 사용하여 그룹 내부의 요소들이 특정 영역 안에만 보이도록 설정합니다. 이 코드에서는 SvgjsClipPath1094라는 ID를 가진 사각형의 영역 안에 있는 원들만 보여집니다.

<rect> 요소는 SVG 내부에 사각형을 그립니다.

<circle> 요소는 SVG 내부에 원을 그립니다. 각각의 원은 r, cx, cy, fill 속성을 가지며, fill 속성 값으로 선형 그라데이션을 참조합니다. 선형 그라데이션은 <linearGradient> 요소를 사용하여 정의됩니다.

<defs> 요소는 SVG 내부에서 사용되는 모든 정의를 포함합니다. 이 코드에서는 clipPath와 linearGradient가 정의됩니다.

그라데이션을 사용하여 채워진 각 원의 색상은 stop 요소를 사용하여 정의됩니다. stop-color 속성은 그라데이션의 색상을 지정하며, offset 속성은 그라데이션의 시작과 끝 위치를 지정합니다.
 */ -->

<!--
CountSVG는 ERC-721 표준을 따르며, ERC721URIStorage를 상속받아 URI(토큰 마다 고유한 메타데이터)를 저장하고 관리합니다. 또한 Ownable을 상속받아 오직 소유자만 safeMint() 함수를 호출할 수 있습니다.
using Counters for Counters.Counter 구문을 사용하여 Counters.Counter 타입의 변수 _tokenIdCounter를 사용하며, 새 토큰이 만들어질 때마다 이를 증가시킵니다.
safeMint() 함수는 _tokenIdCounter를 증가시킨 다음 새로운 토큰을 생성하고, 지정된 수신자(to)에게 안전하게 전송합니다. 마지막으로 updateURI() 함수를 호출하여 새 토큰의 URI를 업데이트합니다.
updateURI() 함수는 buildSVG() 함수를 호출하여 SVG 이미지를 생성하고, 이를 Base64로 인코딩하여 JSON 형식으로 저장합니다. 이를 다시 data URI 형식으로 인코딩한 다음, _setTokenURI() 함수를 사용하여 새 토큰의 URI를 업데이트합니다.
buildSVG() 함수는 미리 정의된 SVG 문자열을 결합하여 완전한 SVG 이미지를 만들어 반환합니다. -->
