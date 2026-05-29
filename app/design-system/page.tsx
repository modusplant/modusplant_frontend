'use client';

import {
  useEffect,
  useMemo,
  useState,
  type MouseEvent,
  type ReactNode,
} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Check,
  ChevronDown,
  Code2,
  Copy,
  ExternalLink,
  FileText,
  Home,
  Layers,
  MessageSquare,
  Minus,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRight,
  Play,
  Plus,
  Search,
  Share2,
} from 'lucide-react';
import Badge from '@/components/_common/badge';
import Button from '@/components/_common/button';
import { Checkbox } from '@/components/_common/checkbox';
import Dropdown from '@/components/_common/dropdown';
import EmptyState from '@/components/_common/emptyState';
import { Input } from '@/components/_common/input';
import PrimaryCategoryFilter from '@/components/_common/primaryCategoryFilter';
import SecondaryCategoryFilter from '@/components/_common/secondaryCategoryFilter';
import Textarea from '@/components/_common/textarea';
import SearchBar from '@/components/search/searchbar';

const figmaUrl =
  'https://www.figma.com/design/KxapIatO2QgYjfAlHRzoL3/%EB%AA%A8%EB%91%90%EC%9D%98%EC%8B%9D%EB%AC%BC?node-id=1-80769&t=3vPb6NRwD41HjVYC-1';

const figmaColorAsset = {
  svg: '/design-system/figma/01.Color.svg',
  pdf: '/design-system/figma/01.Color.pdf',
  jpg: '/design-system/figma/01.Color.jpg',
} as const;

const figmaLogoAsset = {
  symbol: '/design-system/figma/logo/logo-symbol.svg',
  typeASymbol: '/design-system/figma/logo/type-a-symbol.svg',
  typeALogoFavicon: '/design-system/figma/logo/type-a-logo-favicon.svg',
  typeBSymbol: '/design-system/figma/logo/type-b-symbol.svg',
  typeBLogoFavicon: '/design-system/figma/logo/type-b-logo-favicon.svg',
  typography: '/design-system/figma/logo/typography.svg',
  svgZip: '/design-system/figma/logo/logo_svg.zip',
  pdfZip: '/design-system/figma/logo/logo_pdf.zip.zip',
} as const;

const figmaTypographyAsset = {
  svg: '/design-system/figma/02.Typography.svg',
  pdf: '/design-system/figma/02.Typography.pdf',
  png: '/design-system/figma/02.Typography@3x.png',
} as const;

const figmaLayoutAsset = {
  svg: '/design-system/figma/03.Layout.svg',
  png2x: '/design-system/figma/03.Layout@2x.png',
  png3x: '/design-system/figma/03.Layout@3x.png',
} as const;

const figmaImageAsset = {
  svg: '/design-system/figma/04.Image.svg',
  pdf: '/design-system/figma/04.Image.pdf',
  png: '/design-system/figma/04.Image@3x.png',
  image01: '/design-system/figma/image_01.svg',
  image02: '/design-system/figma/image_02.svg',
  image03: '/design-system/figma/image_03.svg',
  image04: '/design-system/figma/image_04.svg',
} as const;

const futureNavItems = ['모달 유형', 'Status', 'Loader'] as const;

const primaryColors = [
  {
    figmaName: 'Primary/10(Hover-1)',
    token: '--primary-10',
    value: '#EBF5EA',
    role: '연한 hover, 약한 강조 배경',
    status: 'synced',
  },
  {
    figmaName: 'Primary/15',
    token: '--primary-15',
    value: '#D2EACE',
    role: '코드에만 있는 보조 톤',
    status: 'check',
  },
  {
    figmaName: 'Primary/20(Hover-2)',
    token: '--primary-20',
    value: '#AED4A9',
    role: 'hover, selected 보조 배경',
    status: 'synced',
  },
  {
    figmaName: 'Primary/30',
    token: '--primary-30',
    value: '#8DC386',
    role: '약한 브랜드 강조',
    status: 'synced',
  },
  {
    figmaName: 'Primary/40',
    token: '--primary-40',
    value: '#5BA952',
    role: 'outline, tertiary action',
    status: 'synced',
  },
  {
    figmaName: 'Primary/50',
    token: '--primary-50',
    value: '#3A972E',
    role: '주요 CTA, 브랜드 기준색',
    status: 'synced',
  },
  {
    figmaName: 'Primary/60',
    token: '--primary-60',
    value: '#296A20',
    role: 'CTA hover',
    status: 'synced',
  },
  {
    figmaName: 'Primary/70',
    token: '--primary-70',
    value: '#235C1C',
    role: '강한 hover, active',
    status: 'synced',
  },
] as const;

const neutralColors = [
  {
    figmaName: 'Worm Gray/White',
    token: '--neutral-100',
    value: '#FFFFFF',
    role: '흰 배경, inverse text',
    status: 'synced',
  },
  {
    figmaName: 'Worm Gray/10(deactivate)',
    token: '--neutral-90',
    value: '#E4E4E4',
    role: 'disabled, 약한 선',
    status: 'synced',
  },
  {
    figmaName: 'Worm Gray/20(Stroke-1)',
    token: '--neutral-80',
    value: '#C2C2C2',
    role: '보조 선, 비활성 아이콘',
    status: 'synced',
  },
  {
    figmaName: 'Worm Gray/30(Stroke-2)',
    token: '--neutral-70',
    value: '#ADADAD',
    role: 'placeholder, muted icon',
    status: 'synced',
  },
  {
    figmaName: 'Worm Gray/40(Stroke-3)',
    token: '--neutral-60',
    value: '#919191',
    role: '보조 텍스트',
    status: 'synced',
  },
  {
    figmaName: 'Worm Gray/50',
    token: '--neutral-50',
    value: '#777777',
    role: '중간 강조 텍스트',
    status: 'synced',
  },
  {
    figmaName: 'Worm Gray/60',
    token: '--neutral-40',
    value: '#515151',
    role: '본문 보조',
    status: 'synced',
  },
  {
    figmaName: 'Worm Gray/70',
    token: '--neutral-30',
    value: '#414141',
    role: '본문 텍스트',
    status: 'synced',
  },
  {
    figmaName: 'Worm Gray/80',
    token: '--neutral-20',
    value: '#313131',
    role: '강한 텍스트',
    status: 'synced',
  },
  {
    figmaName: 'Worm Gray/90',
    token: '--neutral-10',
    value: '#212121',
    role: '제목 텍스트',
    status: 'synced',
  },
  {
    figmaName: 'Worm Gray/100',
    token: '--neutral-5',
    value: '#111111',
    role: '가장 강한 텍스트',
    status: 'synced',
  },
  {
    figmaName: 'Worm Gray/Black',
    token: '--neutral-0',
    value: '#000000',
    role: 'black, high contrast',
    status: 'synced',
  },
] as const;

const surfaceColors = [
  {
    figmaName: 'Surface/Stroke',
    token: '--surface-stroke',
    value: '#E9E9E9',
    role: '얇은 divider, subtle border',
    status: 'synced',
  },
  {
    figmaName: 'Surface/99',
    token: '--surface-99',
    value: '#F9F9FA',
    role: '밝은 페이지/패널 배경',
    status: 'synced',
  },
  {
    figmaName: 'Surface/98',
    token: '--surface-98',
    value: '#F3F4F5',
    role: 'muted panel, table row',
    status: 'synced',
  },
  {
    figmaName: 'Surface/Stroke-2',
    token: '--surface-stroke-2',
    value: '#DBDBDB',
    role: 'form border, stronger divider',
    status: 'check',
  },
] as const;

const systemColors = [
  {
    figmaName: 'System/Yellow',
    token: '--system-alert',
    value: '#F44335',
    role: '경고/오류. Figma 이름과 실제 색상명 확인 필요',
    status: 'check',
  },
  {
    figmaName: 'System/Blue',
    token: '--system-info',
    value: '#3B82F6',
    role: '정보, 안내 상태',
    status: 'synced',
  },
] as const;

const shadowTokens = [
  {
    figmaName: 'Shadow/Pop-up',
    token: '--shadow-pop-up-value',
    value: '0 4px 10px rgb(0 0 0 / 10%)',
    role: '모달, 드롭다운, popover',
    status: 'synced',
  },
  {
    figmaName: 'Search entry shadow',
    token: '--shadow-search-entry-value',
    value: '2px 2px 8px rgb(28 74 54 / 15%)',
    role: '검색 진입 UI',
    status: 'code',
  },
] as const;

const semanticTokens = [
  ['text.default', '--text-default', '기본 본문'],
  ['text.muted', '--text-muted', '보조 정보'],
  ['surface.card', '--surface-card', '카드/패널 배경'],
  ['border.default', '--border-default', '기본 경계'],
  ['action.primary.bg', '--action-primary-bg', '주요 CTA'],
  ['feedback.error', '--feedback-error', '오류/위험'],
  ['focus.ring', '--focus-ring', '키보드 포커스'],
] as const;

const colorAuditItems = [
  'Figma 이름 `Worm Gray`가 실제 의도상 `Warm Gray`인지 확인이 필요합니다.',
  'Primary는 코드에 `primary-15`가 있지만 01.Color SVG에는 보이지 않아 사용 여부를 정해야 합니다.',
  '`System/Yellow`는 이름과 달리 값이 #F44335 red 계열이라 alert/error 네이밍으로 정리하는 편이 안전합니다.',
  '색상별 접근성 기준이 아직 없습니다. CTA, 본문, 비활성, 오류 텍스트의 최소 contrast 조합을 추가하면 좋습니다.',
  'Dark mode를 계획한다면 지금 단계에서 light/dark semantic token 이름을 먼저 고정해야 합니다.',
] as const;

const colorNameMappingRows = [
  {
    figmaName: 'Primary/10(Hover-1)',
    codeName: '--primary-10',
    value: '#EBF5EA',
    status: 'renamed',
    reason:
      'Figma 이름에 상태가 포함되어 있고, 코드는 색상 scale만 유지합니다.',
    action: 'hover 의미는 semantic/action token에서 분리 관리합니다.',
  },
  {
    figmaName: 'Primary/20(Hover-2)',
    codeName: '--primary-20',
    value: '#AED4A9',
    status: 'renamed',
    reason: 'Figma 상태명과 코드 primitive 이름이 다릅니다.',
    action: '값은 유지하고 상태 역할은 문서/semantic token에 표시합니다.',
  },
  {
    figmaName: 'Figma 없음',
    codeName: '--primary-15',
    value: '#D2EACE',
    status: 'codeOnly',
    reason:
      '코드에는 있지만 01.Color SVG에서는 별도 style name이 확인되지 않습니다.',
    action:
      '실제 사용처가 없으면 제거 후보, 사용 중이면 Figma 보완 요청입니다.',
  },
  {
    figmaName: 'Worm Gray/*',
    codeName: '--neutral-*',
    value: 'gray scale',
    status: 'needsDecision',
    reason:
      'Figma family name과 코드 family name이 다르고, White/Black scale 방향도 다릅니다.',
    action: '`Worm` 오타 여부와 scale naming 정책을 디자이너에게 확인합니다.',
  },
  {
    figmaName: 'Surface/Stroke, Surface/99, Surface/98',
    codeName: '--surface-stroke, --surface-99, --surface-98',
    value: '#E9E9E9, #F9F9FA, #F3F4F5',
    status: 'matched',
    reason: '역할과 값이 코드 토큰과 대체로 일치합니다.',
    action: 'Surface/Stroke-2만 Figma style 존재 여부를 추가 확인합니다.',
  },
  {
    figmaName: 'System/Yellow',
    codeName: '--system-alert',
    value: '#F44335',
    status: 'needsDecision',
    reason: 'Figma 이름은 Yellow지만 실제 값은 red 계열입니다.',
    action:
      'alert/error/red로 이름을 고치거나 실제 yellow 값을 새로 받아야 합니다.',
  },
  {
    figmaName: 'Shadow/Pop-up',
    codeName: '--shadow-pop-up-value',
    value: '0 4px 10px rgb(0 0 0 / 10%)',
    status: 'matched',
    reason:
      'SVG filter에서 offset/blur/opacity를 추출해 코드 토큰으로 맞췄습니다.',
    action: '드롭다운/모달 컴포넌트에 적용 여부를 별도 확인합니다.',
  },
] as const;

const logoNameMappingRows = [
  {
    figmaName: 'Logo.svg',
    codeName: '/logo_favicon/favicon_v2_green.svg',
    value: '#3A972E + white symbol',
    status: 'matched',
    reason:
      '원본은 500x500 정사각 심볼이고, 코드 favicon은 같은 심볼 계열을 88x88 앱 아이콘 형태로 사용합니다.',
    action: 'favicon, compact mark는 v2 symbol 기준을 유지합니다.',
  },
  {
    figmaName: 'Logo v1 / Green',
    codeName: '/logo_favicon/Logo_v1_green.svg',
    value: 'legacy wordmark',
    status: 'archived',
    reason:
      '코드 검색 기준 실제 화면 사용처가 확인되지 않고 public 자산으로만 남아 있습니다.',
    action: '운영 로고 시스템에서는 제외하고 보관/삭제 후보로 관리합니다.',
  },
  {
    figmaName: 'Type A / Symbol',
    codeName: '/logo_favicon/favicon_v2_*.svg',
    value: 'green, white symbol variants',
    status: 'matched',
    reason: '현재 서비스의 v2 심볼 자산과 역할이 맞습니다.',
    action: '신규 화면에서는 Type A/v2를 기본 로고 계열로 표시합니다.',
  },
  {
    figmaName: 'Type A / Logo & Pavicon',
    codeName: '/logo_favicon/Logo_v2_*.svg',
    value: 'green, black, white wordmark variants',
    status: 'renamed',
    reason:
      'Figma 프레임명에는 Pavicon 오타가 있고, 코드는 로고와 favicon 파일을 분리해 관리합니다.',
    action: '문서와 코드 표기는 Logo & Favicon으로 정규화합니다.',
  },
  {
    figmaName: 'Type B / Symbol',
    codeName: 'not wired in runtime assets',
    value: 'm shaped symbol variants',
    status: 'needsDecision',
    reason:
      'export 원본은 보관했지만 현재 public/logo_favicon 운영 자산에는 Type B 전용 파일이 없습니다.',
    action:
      'Type B를 앞으로 사용할 브랜드안으로 확정하면 SVG를 런타임 자산명으로 추가합니다.',
  },
  {
    figmaName: 'ModusPlant / Modusplant',
    codeName: 'Logo_v2_* file family',
    value: 'brand wordmark casing',
    status: 'needsDecision',
    reason:
      '기존 코드와 일부 자산은 ModusPlant, Figma Type B 예시는 Modusplant로 보입니다.',
    action: '브랜드 영문 표기 대소문자를 하나로 확정합니다.',
  },
  {
    figmaName: 'Typography / logo font',
    codeName: 'SVG asset, not live text token',
    value: 'NanumSquareRound, Fredoka',
    status: 'needsDecision',
    reason:
      '로고는 SVG 자산으로 쓰면 앱 typography token과 분리됩니다. 텍스트로 재현하려면 폰트 파일과 라이선스 확인이 필요합니다.',
    action: '로고는 SVG 사용을 기본으로 두고, 텍스트 재현은 별도 결정합니다.',
  },
] as const;

const logoAssets = [
  {
    name: 'Logo v2 / Green',
    path: '/logo_favicon/Logo_v2_green.svg',
    usage: '브랜드 컬러 wordmark. 현재 화면 직접 사용처는 없음',
    width: 274,
    height: 56,
    surface: 'light',
    status: '브랜드 보유',
  },
  {
    name: 'Logo v2 / Black',
    path: '/logo_favicon/Logo_v2_black.svg',
    usage: '헤더 스크롤 상태, 푸터, 로그인 화면',
    width: 214,
    height: 46,
    surface: 'light',
    status: '사용 중',
  },
  {
    name: 'Logo v2 / White',
    path: '/logo_favicon/Logo_v2_white.svg',
    usage: '메인 헤더의 투명/어두운 배경 상태',
    width: 214,
    height: 46,
    surface: 'dark',
    status: '사용 중',
  },
  {
    name: 'Symbol v2 / Green',
    path: '/logo_favicon/favicon_v2_green.svg',
    usage: 'metadata favicon, compact mark 기준',
    width: 88,
    height: 88,
    surface: 'light',
    status: '사용 중',
  },
  {
    name: 'Symbol v2 / White',
    path: '/logo_favicon/favicon_v2_white.svg',
    usage: '어두운 배경 compact mark 후보',
    width: 88,
    height: 88,
    surface: 'brand',
    status: '브랜드 보유',
  },
] as const;

const legacyLogoRows = [
  {
    asset: '/logo_favicon/Logo_v1_green.svg',
    role: 'legacy green wordmark',
    usage: '코드 검색 기준 실제 화면 사용처 없음',
  },
  {
    asset: '/logo_favicon/Logo_v1_white.svg',
    role: 'legacy white wordmark',
    usage: '코드 검색 기준 실제 화면 사용처 없음',
  },
  {
    asset: '/logo_favicon/favicon_v1_green.svg',
    role: 'legacy green symbol',
    usage: '코드 검색 기준 실제 화면 사용처 없음',
  },
  {
    asset: '/logo_favicon/favicon_v1_white.svg',
    role: 'legacy white symbol',
    usage: '코드 검색 기준 실제 화면 사용처 없음',
  },
] as const;

const logoUsageRows = [
  {
    surface: 'Header logo',
    codePath: 'components/_layout/header/headerLogo.tsx',
    asset: 'Logo_v2_black.svg / Logo_v2_white.svg',
    status: '사용 중',
  },
  {
    surface: 'Footer logo',
    codePath: 'components/_layout/footer.tsx',
    asset: 'Logo_v2_black.svg',
    status: '사용 중',
  },
  {
    surface: 'Login logo',
    codePath: 'app/(auth)/login/page.tsx',
    asset: 'Logo_v2_black.svg',
    status: '사용 중',
  },
  {
    surface: 'Metadata favicon',
    codePath: 'lib/metadata/layout.ts',
    asset: 'favicon_v2_green.svg',
    status: '사용 중',
  },
  {
    surface: 'Open Graph image',
    codePath: 'lib/metadata/helpers.ts',
    asset: 'og-image-v2.png',
    status: '사용 중',
  },
] as const;

const logoSourceRows = [
  {
    source: 'figma_export/00.logo/Logo.svg',
    appPath: figmaLogoAsset.symbol,
    role: '개별 symbol 원본',
    status: '정리 완료',
  },
  {
    source: 'figma_export/00.logo/logo_svg.zip',
    appPath: figmaLogoAsset.svgZip,
    role: 'Type A/B, Typography SVG 원본 묶음',
    status: '보관',
  },
  {
    source: 'figma_export/00.logo/logo_pdf.zip.zip',
    appPath: figmaLogoAsset.pdfZip,
    role: 'PDF 원본 묶음',
    status: '보관',
  },
  {
    source: 'figma_export/00.logo/Type A*.svg',
    appPath: `${figmaLogoAsset.typeASymbol}, ${figmaLogoAsset.typeALogoFavicon}`,
    role: 'Type A 참고 프레임',
    status: '운영 자산과 매핑',
  },
  {
    source: 'figma_export/00.logo/Type B*.svg',
    appPath: `${figmaLogoAsset.typeBSymbol}, ${figmaLogoAsset.typeBLogoFavicon}`,
    role: 'Type B 참고 프레임',
    status: '결정 필요',
  },
  {
    source: 'figma_export/00.logo/Typography.svg',
    appPath: figmaLogoAsset.typography,
    role: '로고 타이포 참고 프레임',
    status: '참고',
  },
] as const;

const typographySourceRows = [
  {
    source: 'figma_export/02.Typography/02.Typography.svg',
    appPath: figmaTypographyAsset.svg,
    role: 'Figma typography guide vector 원본',
    status: '정리 완료',
  },
  {
    source: 'figma_export/02.Typography/02.Typography.pdf',
    appPath: figmaTypographyAsset.pdf,
    role: '공유/검수용 PDF 원본',
    status: '보관',
  },
  {
    source: 'figma_export/02.Typography/02.Typography@3x.png',
    appPath: figmaTypographyAsset.png,
    role: '이미지 기준 비교용 export',
    status: '보관',
  },
] as const;

const typographyFamilyRows = [
  {
    role: '강조',
    figmaName: '나눔 명조 Nanum Myeongjo',
    codeName: 'font-emphasis / --font-emphasis',
    usage: '브랜드의 유기적이고 감성적인 제목, 히어로성 문구',
    status: 'needsDecision',
    note: '현재 next/font 설정은 latin subset만 preload합니다. 한국어 명조 렌더링을 확정하려면 Korean subset 또는 local font 보강이 필요합니다.',
  },
  {
    role: '본문',
    figmaName: '프리텐다드 Pretendard',
    codeName: 'font-body / --font-body',
    usage: '일반 본문, 입력, 라벨, 버튼, 테이블',
    status: 'matched',
    note: 'Regular, Medium, SemiBold, Bold woff2가 local font로 연결되어 있습니다.',
  },
] as const;

const typographySpecRows = [
  {
    figmaName: 'Heading1',
    figmaStyle: 'heading/heading1',
    codeName: 'not defined',
    role: '큰 브랜드 강조 제목',
    size: '44px',
    weight: 'Bold',
    weightValue: 700,
    lineHeight: '120%',
    lineHeightValue: '1.2',
    figmaLetterSpacing: '-4px',
    codeLetterSpacing: 'not mapped',
    sample: '나눔 명조 Nanum Myeongjo',
    family: 'emphasis',
    status: 'needsDecision',
    note: 'Figma에는 있지만 코드 utility로는 아직 없습니다.',
  },
  {
    figmaName: 'Heading2',
    figmaStyle: 'heading/heading2',
    codeName: 'not defined',
    role: '중간 브랜드 강조 제목',
    size: '34px',
    weight: 'Bold',
    weightValue: 700,
    lineHeight: '120%',
    lineHeightValue: '1.2',
    figmaLetterSpacing: '-4px',
    codeLetterSpacing: 'not mapped',
    sample: 'heading/heading2',
    family: 'emphasis',
    status: 'needsDecision',
    note: '섹션 제목과 실제 사용처를 정한 뒤 token화가 필요합니다.',
  },
  {
    figmaName: 'Label1',
    figmaStyle: 'label/label1',
    codeName: 'not defined',
    role: '큰 라벨/카테고리',
    size: '24px',
    weight: 'Bold',
    weightValue: 700,
    lineHeight: '150%',
    lineHeightValue: '1.5',
    figmaLetterSpacing: '-4px',
    codeLetterSpacing: 'not mapped',
    sample: 'label/label1',
    family: 'body',
    status: 'needsDecision',
    note: '라벨 계열 이름은 Figma에만 있고 코드 utility는 없습니다.',
  },
  {
    figmaName: 'Label2',
    figmaStyle: 'label/label2',
    codeName: 'not defined',
    role: '보조 라벨/필터 그룹',
    size: '20px',
    weight: 'Bold',
    weightValue: 700,
    lineHeight: '150%',
    lineHeightValue: '1.5',
    figmaLetterSpacing: '-4px',
    codeLetterSpacing: 'not mapped',
    sample: 'label/label2',
    family: 'body',
    status: 'needsDecision',
    note: 'title/bold 20과 크기가 같아 역할 분리가 필요합니다.',
  },
  {
    figmaName: 'Bold 20',
    figmaStyle: 'title/bold 20',
    codeName: 'typo-bold20',
    role: '섹션 제목',
    size: '20px',
    weight: 'Bold',
    weightValue: 700,
    lineHeight: '150%',
    lineHeightValue: '1.5',
    figmaLetterSpacing: '-1px',
    codeLetterSpacing: '-0.01em',
    sample: 'title/bold 20',
    family: 'body',
    status: 'renamed',
    note: '크기/굵기/행간은 맞지만 Figma 이름과 코드 이름, 자간 단위가 다릅니다.',
  },
  {
    figmaName: 'medium 18',
    figmaStyle: 'body/medium 18',
    codeName: 'not defined',
    role: '강조 본문',
    size: '18px',
    weight: 'Medium',
    weightValue: 500,
    lineHeight: '150%',
    lineHeightValue: '1.5',
    figmaLetterSpacing: '-1px',
    codeLetterSpacing: 'not mapped',
    sample: 'body/medium 18',
    family: 'body',
    status: 'needsDecision',
    note: '18px 본문 계열은 코드 utility가 아직 없습니다.',
  },
  {
    figmaName: 'regular 18',
    figmaStyle: 'body/regular 18',
    codeName: 'not defined',
    role: '큰 본문',
    size: '18px',
    weight: 'Regular',
    weightValue: 400,
    lineHeight: '150%',
    lineHeightValue: '1.5',
    figmaLetterSpacing: '-1px',
    codeLetterSpacing: 'not mapped',
    sample: 'body/regular 18',
    family: 'body',
    status: 'needsDecision',
    note: '상세 페이지 본문에서 실제 사용 여부를 확인해야 합니다.',
  },
  {
    figmaName: 'semibold 16',
    figmaStyle: 'body/semibold 16',
    codeName: 'not defined',
    role: '본문 내 강조',
    size: '16px',
    weight: 'SemiBold',
    weightValue: 600,
    lineHeight: '150%',
    lineHeightValue: '1.5',
    figmaLetterSpacing: '-1px',
    codeLetterSpacing: 'not mapped',
    sample: 'body/semibold 16',
    family: 'body',
    status: 'needsDecision',
    note: '서비스 기본 본문 크기 후보라 Storybook 반영이 필요합니다.',
  },
  {
    figmaName: 'regular 16',
    figmaStyle: 'body/regular 16',
    codeName: 'not defined',
    role: '기본 본문',
    size: '16px',
    weight: 'Regular',
    weightValue: 400,
    lineHeight: '150%',
    lineHeightValue: '1.5',
    figmaLetterSpacing: '-1px',
    codeLetterSpacing: 'not mapped',
    sample: 'body/regular 16',
    family: 'body',
    status: 'needsDecision',
    note: 'Tailwind 기본 text-base와 역할을 합칠지 결정해야 합니다.',
  },
  {
    figmaName: 'bold 15',
    figmaStyle: 'body/bold 15',
    codeName: 'typo-bold15',
    role: '작은 본문 강조',
    size: '15px',
    weight: 'Bold',
    weightValue: 700,
    lineHeight: '120%',
    lineHeightValue: '1.2',
    figmaLetterSpacing: '-1px',
    codeLetterSpacing: '-0.01em',
    sample: 'body/bold 15',
    family: 'body',
    status: 'needsDecision',
    note: '코드 utility는 line-height 1.4라 Figma와 다릅니다.',
  },
  {
    figmaName: 'regular 15',
    figmaStyle: 'body/regular 15',
    codeName: 'not defined',
    role: '작은 본문',
    size: '15px',
    weight: 'Regular',
    weightValue: 400,
    lineHeight: '150%',
    lineHeightValue: '1.5',
    figmaLetterSpacing: '-1px',
    codeLetterSpacing: 'not mapped',
    sample: 'body/regular 15',
    family: 'body',
    status: 'needsDecision',
    note: '현재 코드에는 15px regular utility가 없습니다.',
  },
  {
    figmaName: 'bold 14',
    figmaStyle: 'caption/bold 14',
    codeName: 'not defined',
    role: 'caption 강조',
    size: '14px',
    weight: 'Bold',
    weightValue: 700,
    lineHeight: '120%',
    lineHeightValue: '1.2',
    figmaLetterSpacing: '-1px',
    codeLetterSpacing: 'not mapped',
    sample: 'caption/bold 14',
    family: 'body',
    status: 'needsDecision',
    note: 'caption bold utility가 필요합니다.',
  },
  {
    figmaName: 'medium 14',
    figmaStyle: 'caption/medium 14',
    codeName: 'typo-medium',
    role: 'caption 중간 강조',
    size: '14px',
    weight: 'Medium',
    weightValue: 500,
    lineHeight: '120%',
    lineHeightValue: '1.2',
    figmaLetterSpacing: '-1px',
    codeLetterSpacing: '-0.01em',
    sample: 'caption/medium 14',
    family: 'body',
    status: 'renamed',
    note: '값은 가깝지만 코드 이름이 size를 담지 않습니다.',
  },
  {
    figmaName: 'medium 13',
    figmaStyle: 'caption/medium 13',
    codeName: 'not defined',
    role: '작은 메타 정보',
    size: '13px',
    weight: 'Medium',
    weightValue: 500,
    lineHeight: '120%',
    lineHeightValue: '1.2',
    figmaLetterSpacing: '-1px',
    codeLetterSpacing: 'not mapped',
    sample: 'caption/medium 13',
    family: 'body',
    status: 'needsDecision',
    note: '댓글/날짜/보조 정보에 쓰는지 확인이 필요합니다.',
  },
  {
    figmaName: 'regular 13',
    figmaStyle: 'caption/regular 13',
    codeName: 'not defined',
    role: '가장 작은 메타 정보',
    size: '13px',
    weight: 'Regular',
    weightValue: 400,
    lineHeight: '120%',
    lineHeightValue: '1.2',
    figmaLetterSpacing: '-1px',
    codeLetterSpacing: 'not mapped',
    sample: 'caption/regular 13',
    family: 'body',
    status: 'needsDecision',
    note: '서비스 접근성 기준에서 최소 크기 사용 범위를 정해야 합니다.',
  },
] as const;

const typographyCodeOnlyRows = [
  {
    codeName: 'typo-regular14',
    figmaName: 'not in 02.Typography',
    value: '14px / Regular / 120% / -0.01em',
    reason: '현재 코드 utility지만 Figma 표에는 같은 이름이 없습니다.',
  },
  {
    codeName: 'typo-semibold14',
    figmaName: 'not in 02.Typography',
    value: '14px / SemiBold / 140% / -0.01em',
    reason: 'Figma caption 계열과 행간이 다르므로 유지 여부를 결정해야 합니다.',
  },
] as const;

const typographyAuditItems = [
  'Heading1, Heading2, Label1, Label2가 Figma에는 있지만 현재 코드 utility로는 없습니다.',
  'Figma 자간은 -4px 또는 -1px이고, 현재 일부 코드 utility는 -0.01em입니다. 운영 기준을 px, em, 0px 중 하나로 정해야 합니다.',
  'Nanum Myeongjo는 한국어 강조용으로 보이지만 현재 next/font preload 설정은 latin subset입니다. 실제 한국어 글리프 렌더링 확인이 필요합니다.',
  '15px, 16px, 18px 본문 계열은 Figma 표가 더 상세합니다. 실제 화면에서 사용하는 크기만 남기고 Storybook에 등록하는 편이 좋습니다.',
  'Typography token 이름은 Figma style name과 코드 utility name을 1:1로 맞추거나, 이 페이지의 매핑표를 기준으로 관리해야 합니다.',
] as const;

const layoutRows = [
  {
    id: 'layout-pc',
    label: 'PC',
    range: '1024-2560px',
    contentArea: '984-1320px',
    columns: '12',
    gutter: '20px',
    margin: 'min 20px',
    note: '데스크톱 운영 기준. 현재 페이지 중앙 프레임 max width도 1320px로 맞춥니다.',
  },
  {
    id: 'layout-tablet',
    label: 'Tablet',
    range: '768-1023px',
    contentArea: '728-983px',
    columns: '8',
    gutter: '20px',
    margin: '20px',
    note: '태블릿은 8컬럼으로 콘텐츠 폭을 줄이고 주요 그리드만 유지합니다.',
  },
  {
    id: 'layout-mobile',
    label: 'Mobile',
    range: '320-767px',
    contentArea: '288-735px',
    columns: '6',
    gutter: '10px',
    margin: '20px',
    note: '모바일은 좌우 20px 여백, 6컬럼, 10px gutter를 기본으로 봅니다.',
  },
] as const;

const layoutSourceRows = [
  {
    source: 'figma_export/03.Layout/03.Layout.svg',
    appPath: figmaLayoutAsset.svg,
    role: 'Figma layout guide vector 원본',
    status: '정리 완료',
  },
  {
    source: 'figma_export/03.Layout/03.Layout@2x.png',
    appPath: figmaLayoutAsset.png2x,
    role: '화면 비교용 PNG',
    status: '보관',
  },
  {
    source: 'figma_export/03.Layout/03.Layout@3x.png',
    appPath: figmaLayoutAsset.png3x,
    role: '고해상도 비교용 PNG',
    status: '보관',
  },
] as const;

const imageRows = [
  {
    id: 'image-basic-01',
    name: 'Plant illustration 01',
    source: figmaImageAsset.image01,
    role: '기본 식물 일러스트',
    usage: '빈 상태, 안내 카드, 부드러운 브랜드 장면',
  },
  {
    id: 'image-basic-02',
    name: 'Plant illustration 02',
    source: figmaImageAsset.image02,
    role: '기본 식물 일러스트',
    usage: '온보딩, 카테고리 대표 이미지',
  },
  {
    id: 'image-photo-01',
    name: 'Plant render 01',
    source: figmaImageAsset.image03,
    role: '식물 렌더/사진 후보',
    usage: '실제 식물 카드, 상세 히어로 보조',
  },
  {
    id: 'image-photo-02',
    name: 'Plant render 02',
    source: figmaImageAsset.image04,
    role: '식물 렌더/사진 후보',
    usage: '커뮤니티 콘텐츠 보조 이미지',
  },
] as const;

const imageSourceRows = [
  {
    source: 'figma_export/04.Image/04.Image.svg',
    appPath: figmaImageAsset.svg,
    role: 'Figma image guide vector 원본',
    status: '정리 완료',
  },
  {
    source: 'figma_export/04.Image/04.Image.pdf',
    appPath: figmaImageAsset.pdf,
    role: '공유/검수용 PDF 원본',
    status: '보관',
  },
  {
    source: 'figma_export/04.Image/image_*.svg',
    appPath: '/design-system/figma/image_*.svg',
    role: '개별 이미지 자산',
    status: '운영 후보',
  },
] as const;

const componentRows = [
  [
    'Button',
    'components/_common/button.tsx',
    'stories/components/common/Button.stories.tsx',
    'matched',
  ],
  [
    'Input',
    'components/_common/input.tsx',
    'stories/components/common/Input.stories.tsx',
    'matched',
  ],
  [
    'Textarea',
    'components/_common/textarea.tsx',
    'stories/components/common/Textarea.stories.tsx',
    'matched',
  ],
  [
    'Dropdown',
    'components/_common/dropdown.tsx',
    'stories/components/common/Dropdown.stories.tsx',
    'matched',
  ],
  [
    'CategoryFilter',
    'components/_common/*CategoryFilter.tsx',
    'stories/components/common/CategoryFilter.stories.tsx',
    'matched',
  ],
  [
    'EmptyState',
    'components/_common/emptyState.tsx',
    'stories/components/common/EmptyState.stories.tsx',
    'matched',
  ],
  [
    'Logo',
    'public/logo_favicon/*.svg',
    'app/design-system/page.tsx#logo',
    'matched',
  ],
  ['Badge', 'components/_common/badge.tsx', 'pending', 'partial'],
  ['Checkbox', 'components/_common/checkbox.tsx', 'pending', 'partial'],
] as const;

const inspectorNodes = [
  {
    id: 'cover',
    label: 'cover',
    kind: 'Frame',
    href: '#cover',
    description:
      '디자인 시스템 운영 방향과 원본 Figma 링크를 보여주는 시작 프레임입니다.',
    layout: [
      ['너비', '1320px max'],
      ['높이', 'Hug contents'],
      ['흐름', '세로'],
      ['상단', '40px'],
      ['좌우 여백', '40px'],
    ],
    content: [
      ['제목', '모두의식물 UI를 코드와 Storybook 기준으로 운영합니다.'],
      ['CTA', '컴포넌트 보기 / Figma 원본'],
    ],
    typography: [
      ['제목', 'Pretendard / 700 / 48px'],
      ['강조', 'Nanum Myeongjo'],
      ['본문', 'Pretendard / 16px / 170%'],
    ],
    colors: [
      ['배경', '#FFFFFF'],
      ['Primary', '#3A972E'],
      ['Text', '#212121'],
    ],
    links: [
      ['Code', 'app/design-system/page.tsx'],
      ['Source', 'docs/design-system'],
    ],
  },
  {
    id: 'logo',
    label: '로고',
    kind: 'Frame',
    href: '#logo',
    description:
      '실제 서비스에서 사용하는 로고 SVG와 Figma 로고 후보를 정리한 프레임입니다.',
    layout: [
      ['너비', '1320px max'],
      ['높이', 'Hug contents'],
      ['그리드', '2-4 columns'],
      ['간격', '16px / 32px'],
      ['라운드', '8px 이하'],
    ],
    content: [
      ['운영 로고', 'Logo_v2 / favicon_v2'],
      ['보관 후보', 'Logo_v1 / Type B'],
    ],
    typography: [
      ['섹션 제목', 'title/bold 20'],
      ['설명', 'Pretendard / 14px / 160%'],
    ],
    colors: [
      ['Primary', '#3A972E'],
      ['Dark preview', '#212121'],
      ['Surface', '#F9F9FA'],
    ],
    links: [
      ['Runtime', 'public/logo_favicon/*'],
      ['Document', 'docs/design-system/foundations/logo.md'],
    ],
  },
  {
    id: 'color',
    label: '01.Color',
    kind: 'Frame',
    href: '#color',
    description:
      'Figma 01.Color export와 코드 CSS variable을 비교하는 컬러 토큰 프레임입니다.',
    layout: [
      ['너비', '1320px max'],
      ['높이', 'Hug contents'],
      ['컬러 그룹', 'Primary / Neutral / Surface / System'],
      ['표 너비', 'min 920px'],
    ],
    content: [
      ['원본', '01.Color.svg / pdf / jpg'],
      ['토큰', 'app/globals.css CSS variables'],
    ],
    typography: [
      ['표 제목', 'Pretendard / 600 / 18px'],
      ['본문', 'Pretendard / 14px'],
    ],
    colors: [
      ['Primary/50', '#3A972E'],
      ['Neutral/90', '#212121'],
      ['Surface/99', '#F9F9FA'],
    ],
    links: [
      ['Code', 'app/globals.css'],
      ['Document', 'docs/design-system/foundations/color.md'],
    ],
  },
  {
    id: 'typography',
    label: '02.Typography',
    kind: 'Frame',
    href: '#typography',
    description:
      'Figma text style 이름과 코드 utility 이름을 연결하는 타이포그래피 프레임입니다.',
    layout: [
      ['너비', '1320px max'],
      ['높이', 'Hug contents'],
      ['원본 이미지', '1342 x 1905'],
      ['표 행 수', '20 rows'],
    ],
    content: [
      ['원본', '02.Typography.svg / pdf / png'],
      ['매핑', 'Figma style -> code utility'],
    ],
    typography: [
      ['본문', 'Pretendard'],
      ['강조', 'Nanum Myeongjo'],
      ['대표 크기', '44 / 34 / 24 / 20 / 18 / 16 / 15 / 14 / 13px'],
    ],
    colors: [
      ['Text', '#212121'],
      ['Primary', '#3A972E'],
      ['Surface', '#F3F4F5'],
    ],
    links: [
      ['Code', 'app/design-system/page.tsx#typography'],
      ['Document', 'docs/design-system/foundations/typography.md'],
    ],
  },
  {
    id: 'layout',
    label: '03.Layout',
    kind: 'Frame',
    href: '#layout',
    description:
      'PC, Tablet, Mobile 환경별 content area, columns, gutter, margin을 정리한 레이아웃 프레임입니다.',
    layout: [
      ['너비', '1320px max'],
      ['높이', 'Hug contents'],
      ['원본 이미지', '1342 x 2953'],
      ['브레이크포인트', 'PC / Tablet / Mobile'],
    ],
    content: [
      ['PC', '1024-2560px / 12 columns'],
      ['Tablet', '768-1023px / 8 columns'],
      ['Mobile', '320-767px / 6 columns'],
    ],
    typography: [
      ['섹션 제목', 'Pretendard / 700 / 24px'],
      ['수치', 'Pretendard / 600 / 14px'],
    ],
    colors: [
      ['Grid fill', '#D2EACE'],
      ['Grid stroke', '#8DC386'],
      ['Surface', '#F9F9FA'],
    ],
    links: [
      ['Source', 'figma_export/03.Layout'],
      ['Asset', '/design-system/figma/03.Layout.svg'],
    ],
  },
  {
    id: 'layout-pc',
    label: 'PC grid',
    kind: 'Frame',
    href: '#layout',
    description: '데스크톱 화면에서 사용하는 12컬럼 레이아웃 기준입니다.',
    layout: [
      ['화면 범위', '1024-2560px'],
      ['Content Area', '984-1320px'],
      ['Columns', '12'],
      ['Gutter', '20px'],
      ['Margin', 'min 20px'],
    ],
    content: [
      ['사용처', '게시글 목록, 상세, 관리자성 넓은 화면'],
      ['코드 후보', 'max-w-[1320px] + responsive grid'],
    ],
    typography: [
      ['레이블', 'Pretendard / 600 / 14px'],
      ['설명', 'Pretendard / 400 / 14px'],
    ],
    colors: [
      ['Column', '#D2EACE'],
      ['Gutter', '#FFFFFF'],
      ['Stroke', '#8DC386'],
    ],
    links: [
      ['Code 기준', 'layout container token 후보'],
      ['Status', '정리 완료 / 코드 토큰화 필요'],
    ],
  },
  {
    id: 'layout-tablet',
    label: 'Tablet grid',
    kind: 'Frame',
    href: '#layout',
    description: '태블릿 화면에서 사용하는 8컬럼 레이아웃 기준입니다.',
    layout: [
      ['화면 범위', '768-1023px'],
      ['Content Area', '728-983px'],
      ['Columns', '8'],
      ['Gutter', '20px'],
      ['Margin', '20px'],
    ],
    content: [
      ['사용처', '태블릿 카드 리스트, 필터 영역'],
      ['코드 후보', 'md:grid-cols-*'],
    ],
    typography: [
      ['레이블', 'Pretendard / 600 / 14px'],
      ['설명', 'Pretendard / 400 / 14px'],
    ],
    colors: [
      ['Column', '#D2EACE'],
      ['Gutter', '#FFFFFF'],
      ['Stroke', '#8DC386'],
    ],
    links: [
      ['Code 기준', 'tablet container token 후보'],
      ['Status', '정리 완료 / 코드 토큰화 필요'],
    ],
  },
  {
    id: 'layout-mobile',
    label: 'Mobile grid',
    kind: 'Frame',
    href: '#layout',
    description: '모바일 화면에서 사용하는 6컬럼 레이아웃 기준입니다.',
    layout: [
      ['화면 범위', '320-767px'],
      ['Content Area', '288-735px'],
      ['Columns', '6'],
      ['Gutter', '10px'],
      ['Margin', '20px'],
    ],
    content: [
      ['사용처', '모바일 피드, 작성 폼, 상세 페이지'],
      ['코드 후보', 'px-5 + grid-cols-6'],
    ],
    typography: [
      ['레이블', 'Pretendard / 600 / 14px'],
      ['설명', 'Pretendard / 400 / 14px'],
    ],
    colors: [
      ['Column', '#D2EACE'],
      ['Gutter', '#FFFFFF'],
      ['Stroke', '#8DC386'],
    ],
    links: [
      ['Code 기준', 'mobile container token 후보'],
      ['Status', '정리 완료 / 코드 토큰화 필요'],
    ],
  },
  {
    id: 'image',
    label: '04.Image',
    kind: 'Frame',
    href: '#image',
    description:
      'Figma의 기본 이미지 자산을 개별 SVG 후보로 나누어 사용처와 운영 기준을 정리한 프레임입니다.',
    layout: [
      ['너비', '1320px max'],
      ['높이', 'Hug contents'],
      ['원본 이미지', '3658 x 956'],
      ['이미지 수', `${imageRows.length} assets`],
    ],
    content: [
      ['자산', 'image_01.svg - image_04.svg'],
      ['분류', 'Illustration / Render 후보'],
    ],
    typography: [
      ['섹션 제목', 'Pretendard / 700 / 24px'],
      ['캡션', 'Pretendard / 400 / 13px'],
    ],
    colors: [
      ['Soft green bg', '#D2EACE'],
      ['Soft cream bg', '#FFF3DE'],
      ['Surface', '#FFFFFF'],
    ],
    links: [
      ['Source', 'figma_export/04.Image'],
      ['Asset', '/design-system/figma/image_*.svg'],
    ],
  },
  {
    id: 'image-basic-01',
    label: 'Plant illustration 01',
    kind: 'Image',
    href: '#image',
    description:
      '연녹색 배경 위 화분 일러스트입니다. 안내/빈 상태에 적합합니다.',
    layout: [
      ['비율', '약 16:10'],
      ['배경', 'soft green'],
      ['형식', 'SVG'],
    ],
    content: [
      ['사용처', '빈 상태, 안내 카드'],
      ['파일', 'image_01.svg'],
    ],
    typography: [['캡션', 'caption/regular 13 후보']],
    colors: [
      ['Background', '#D2EACE'],
      ['Plant green', '#3A972E'],
    ],
    links: [
      ['Public path', figmaImageAsset.image01],
      ['Status', '운영 후보'],
    ],
  },
  {
    id: 'image-basic-02',
    label: 'Plant illustration 02',
    kind: 'Image',
    href: '#image',
    description:
      '크림색 배경 위 화분 일러스트입니다. 온보딩/카테고리 보조에 적합합니다.',
    layout: [
      ['비율', '약 16:10'],
      ['배경', 'soft cream'],
      ['형식', 'SVG'],
    ],
    content: [
      ['사용처', '온보딩, 카테고리 대표 이미지'],
      ['파일', 'image_02.svg'],
    ],
    typography: [['캡션', 'caption/regular 13 후보']],
    colors: [
      ['Background', '#FFF3DE'],
      ['Accent', '#8DC386'],
    ],
    links: [
      ['Public path', figmaImageAsset.image02],
      ['Status', '운영 후보'],
    ],
  },
  {
    id: 'image-photo-01',
    label: 'Plant render 01',
    kind: 'Image',
    href: '#image',
    description:
      '식물 렌더 또는 사진형 이미지 후보입니다. 실제 식물 카드나 상세 화면 보조 이미지로 검토합니다.',
    layout: [
      ['비율', '약 16:10'],
      ['배경', 'transparent/source'],
      ['형식', 'SVG'],
    ],
    content: [
      ['사용처', '식물 카드, 상세 히어로 보조'],
      ['파일', 'image_03.svg'],
    ],
    typography: [['캡션', 'caption/regular 13 후보']],
    colors: [
      ['Plant green', '#3A972E'],
      ['Surface', '#FFFFFF'],
    ],
    links: [
      ['Public path', figmaImageAsset.image03],
      ['Status', '운영 후보'],
    ],
  },
  {
    id: 'image-photo-02',
    label: 'Plant render 02',
    kind: 'Image',
    href: '#image',
    description:
      '커뮤니티 콘텐츠나 보조 장면에 쓸 수 있는 식물 이미지 후보입니다. 사용 여부는 실제 화면 적용 후 결정합니다.',
    layout: [
      ['비율', '약 16:10'],
      ['배경', 'transparent/source'],
      ['형식', 'SVG'],
    ],
    content: [
      ['사용처', '커뮤니티 콘텐츠 보조 이미지'],
      ['파일', 'image_04.svg'],
    ],
    typography: [['캡션', 'caption/regular 13 후보']],
    colors: [
      ['Plant green', '#3A972E'],
      ['Surface', '#FFFFFF'],
    ],
    links: [
      ['Public path', figmaImageAsset.image04],
      ['Status', '운영 후보'],
    ],
  },
  {
    id: 'components',
    label: 'Components',
    kind: 'Frame',
    href: '#components',
    description:
      '현재 서비스에서 실제 렌더링되는 공통 컴포넌트를 확인하는 프레임입니다.',
    layout: [
      ['너비', '1320px max'],
      ['높이', 'Hug contents'],
      ['컬럼', '1-2 columns'],
      ['간격', '20px / 32px'],
    ],
    content: [
      ['컴포넌트', 'Button, Input, Textarea, Dropdown, Filter'],
      ['상태', 'default / hover / disabled / error / loading'],
    ],
    typography: [
      ['기본', 'Pretendard / 14-16px'],
      ['버튼', 'Pretendard / 600'],
    ],
    colors: [
      ['Primary button', '#3A972E'],
      ['Danger', '#F44335'],
      ['Border', '#E9E9E9'],
    ],
    links: [
      ['Code', 'components/_common'],
      ['Storybook', 'stories/components/common'],
    ],
  },
  {
    id: 'map',
    label: 'Component Map',
    kind: 'Table',
    href: '#map',
    description:
      'Figma 컴포넌트 이름, 코드 경로, Storybook 경로를 연결하는 운영 표입니다.',
    layout: [
      ['너비', 'min 760px'],
      ['행', `${componentRows.length} rows`],
      ['컬럼', 'Component / Code / Storybook / Status'],
    ],
    content: [
      ['기준', '코드 경로'],
      ['보조', 'Storybook path'],
    ],
    typography: [
      ['표 헤더', 'Pretendard / 600 / 14px'],
      ['표 본문', 'Pretendard / 14px'],
    ],
    colors: [
      ['Header bg', '#F3F4F5'],
      ['Border', '#E9E9E9'],
      ['Status', '#3A972E'],
    ],
    links: [
      ['Code', 'app/design-system/page.tsx#componentRows'],
      ['Document', 'docs/design-system/figma-source.md'],
    ],
  },
  {
    id: 'modal-types',
    label: '모달 유형',
    kind: 'Frame',
    href: '#components',
    description:
      'Figma의 모달 유형 프레임을 코드 컴포넌트 기준으로 옮겨야 할 후보 레이어입니다.',
    layout: [
      ['너비', '1024-1320px frame'],
      ['높이', 'Hug contents'],
      ['카드 너비', '220-280px 예상'],
      ['간격', '32px'],
    ],
    content: [
      ['확인 모달', '정말 나가시겠어요?'],
      ['삭제 모달', '정말 삭제하시겠어요?'],
      ['등록 모달', '게시글을 등록하시겠어요?'],
    ],
    typography: [
      ['제목', 'Pretendard / 700 / 14-16px'],
      ['본문', 'Pretendard / 400 / 13-14px'],
    ],
    colors: [
      ['Primary', '#3A972E'],
      ['Surface', '#FFFFFF'],
      ['Shadow', '0 4px 10px rgb(0 0 0 / 10%)'],
    ],
    links: [
      ['Target', 'components/_common/modal 후보'],
      ['Status', '구현 필요'],
    ],
  },
  {
    id: 'snackbar',
    label: '스낵바',
    kind: 'Component',
    href: '#components',
    description:
      '짧은 완료/삭제 피드백을 보여주는 toast/snackbar 컴포넌트 후보입니다.',
    layout: [
      ['너비', '145px'],
      ['높이', '24px'],
      ['라운드', '8px 예상'],
      ['그림자', '0 4px 10px rgb(0 0 0 / 10%)'],
    ],
    content: [
      ['텍스트', '댓글을 삭제하였습니다.'],
      ['위치', '화면 하단 또는 작업 근처'],
    ],
    typography: [
      ['글꼴', 'Pretendard'],
      ['굵기', '500 Medium'],
      ['크기', '16px'],
      ['행간', '150%'],
      ['자간', '-1%'],
      ['가로 정렬', '가운데'],
    ],
    colors: [
      ['Text', '#212121'],
      ['Surface', '#FFFFFF'],
      ['Border', '#E9E9E9'],
    ],
    links: [
      ['Target', 'components/_common/snackbar 후보'],
      ['Status', 'Figma only / 구현 필요'],
    ],
  },
  {
    id: 'snackbar-message',
    label: '댓글을 삭제하였습니다.',
    kind: 'Text',
    href: '#components',
    description: '스낵바 내부 메시지 텍스트 레이어입니다.',
    layout: [
      ['너비', '145px'],
      ['높이', '24px'],
      ['상하 padding', '추출 필요'],
      ['가로 정렬', '가운데'],
    ],
    content: [['텍스트', '댓글을 삭제하였습니다.']],
    typography: [
      ['글꼴', 'Pretendard'],
      ['굵기', '500 Medium'],
      ['크기', '16px'],
      ['행간', '150%'],
      ['자간', '-1%'],
    ],
    colors: [
      ['Neutral/neutral10', '#212121'],
      ['Token 후보', '--text-default'],
    ],
    links: [
      ['Target token', 'body/medium 16 후보'],
      ['Status', '디자이너 확인 필요'],
    ],
  },
] as const;

type InspectorNodeId = (typeof inspectorNodes)[number]['id'];
type InspectorNode = (typeof inspectorNodes)[number];
type InspectorTab = 'comments' | 'properties';
type InspectorRow = readonly [string, string];

type ComponentInspection = {
  id: string;
  label: string;
  kind: string;
  description: string;
  layout: InspectorRow[];
  spacing: InspectorRow[];
  childSpacing: InspectorRow[];
  typography: InspectorRow[];
  colors: InspectorRow[];
  links: InspectorRow[];
};

const sidebarLayerItems: Array<{
  id: InspectorNodeId;
  depth: number;
  label: string;
  meta?: string;
}> = [
  { id: 'logo', depth: 0, label: '로고', meta: 'Brand' },
  { id: 'color', depth: 0, label: '01.Color', meta: 'Foundations' },
  { id: 'typography', depth: 0, label: '02.Typography', meta: 'Foundations' },
  { id: 'layout', depth: 0, label: '03.Layout', meta: 'Foundations' },
  { id: 'layout-pc', depth: 1, label: 'PC grid', meta: '1024-2560px' },
  { id: 'layout-tablet', depth: 1, label: 'Tablet grid', meta: '768-1023px' },
  { id: 'layout-mobile', depth: 1, label: 'Mobile grid', meta: '320-767px' },
  { id: 'image', depth: 0, label: '04.Image', meta: 'Foundations' },
  {
    id: 'image-basic-01',
    depth: 1,
    label: 'Plant illustration 01',
    meta: 'SVG',
  },
  {
    id: 'image-basic-02',
    depth: 1,
    label: 'Plant illustration 02',
    meta: 'SVG',
  },
  {
    id: 'image-photo-01',
    depth: 1,
    label: 'Plant render 01',
    meta: 'SVG',
  },
  {
    id: 'image-photo-02',
    depth: 1,
    label: 'Plant render 02',
    meta: 'SVG',
  },
  { id: 'modal-types', depth: 0, label: '모달 유형', meta: 'Frame' },
  { id: 'snackbar', depth: 1, label: '스낵바', meta: 'Component' },
  {
    id: 'snackbar-message',
    depth: 2,
    label: '댓글을 삭제하였습니다.',
    meta: 'Text',
  },
  { id: 'components', depth: 0, label: 'Components', meta: 'Live UI' },
  { id: 'map', depth: 0, label: 'Component Map', meta: 'Governance' },
];

const defaultInspectorNode = inspectorNodes[0];

function findInspectorNode(id: InspectorNodeId) {
  return inspectorNodes.find((node) => node.id === id) ?? defaultInspectorNode;
}

function formatPixelValue(value: number) {
  return `${Number.isInteger(value) ? value : value.toFixed(1)}px`;
}

function normalizeCssValue(value: string) {
  return value
    .replace(/-?\d+(\.\d+)?e\+\d+px/g, '9999px+')
    .replace(/\b\d{5,}(\.\d+)?px\b/g, '9999px+');
}

function formatElementText(element: HTMLElement, fallback: string) {
  const text = element.textContent?.replace(/\s+/g, ' ').trim();

  if (!text) {
    return fallback;
  }

  return text.length > 28 ? `${text.slice(0, 28)}...` : text;
}

function getElementDisplayName(element: HTMLElement, index: number) {
  return (
    element.dataset.inspectLabel ||
    element.getAttribute('aria-label') ||
    formatElementText(element, `${element.tagName.toLowerCase()} ${index + 1}`)
  );
}

function getChildSpacingRows(element: HTMLElement): InspectorRow[] {
  const children = Array.from(element.children)
    .filter((child): child is HTMLElement => child instanceof HTMLElement)
    .map((child) => ({
      element: child,
      rect: child.getBoundingClientRect(),
    }))
    .filter(({ rect }) => rect.width > 0 && rect.height > 0)
    .sort((first, second) => {
      const topDiff = first.rect.top - second.rect.top;

      return Math.abs(topDiff) > 2
        ? topDiff
        : first.rect.left - second.rect.left;
    });

  if (children.length < 2) {
    return [['직접 자식', `${children.length}개`]];
  }

  return children.slice(1).map(({ element: child, rect }, index) => {
    const previous = children[index];
    const previousLabel = getElementDisplayName(previous.element, index);
    const nextLabel = getElementDisplayName(child, index + 1);
    const sameRow = Math.abs(previous.rect.top - rect.top) < 4;
    const gap = sameRow
      ? rect.left - previous.rect.right
      : rect.top - previous.rect.bottom;
    const axis = sameRow ? 'x gap' : 'y gap';

    return [
      `${previousLabel} -> ${nextLabel}`,
      `${axis} ${formatPixelValue(gap)}`,
    ];
  });
}

function measureComponentElement(element: HTMLElement): ComponentInspection {
  const rect = element.getBoundingClientRect();
  const style = window.getComputedStyle(element);
  const label =
    element.dataset.inspectLabel ||
    formatElementText(element, element.tagName.toLowerCase());

  return {
    id: element.dataset.inspectId ?? 'unknown',
    label,
    kind: element.dataset.inspectKind ?? element.tagName.toLowerCase(),
    description:
      element.dataset.inspectDescription ??
      '브라우저 DOM에서 계산한 현재 렌더링 값입니다.',
    layout: [
      ['너비', formatPixelValue(rect.width)],
      ['높이', formatPixelValue(rect.height)],
      ['X', formatPixelValue(rect.left)],
      ['Y', formatPixelValue(rect.top)],
      ['Display', style.display],
      ['Position', style.position],
    ],
    spacing: [
      ['Padding top', style.paddingTop],
      ['Padding right', style.paddingRight],
      ['Padding bottom', style.paddingBottom],
      ['Padding left', style.paddingLeft],
      ['Margin top', style.marginTop],
      ['Margin right', style.marginRight],
      ['Margin bottom', style.marginBottom],
      ['Margin left', style.marginLeft],
      ['Gap', style.gap],
      ['Row gap', style.rowGap],
      ['Column gap', style.columnGap],
      ['Radius', normalizeCssValue(style.borderRadius)],
    ],
    childSpacing: getChildSpacingRows(element),
    typography: [
      [
        'Font',
        style.fontFamily.split(',')[0]?.replaceAll('"', '') ?? style.fontFamily,
      ],
      ['Weight', style.fontWeight],
      ['Size', style.fontSize],
      ['Line height', style.lineHeight],
      ['Letter spacing', style.letterSpacing],
      ['Align', style.textAlign],
    ],
    colors: [
      ['Text', style.color],
      ['Background', style.backgroundColor],
      ['Border', style.borderColor],
    ],
    links: [
      ['Inspect id', element.dataset.inspectId ?? 'unknown'],
      ['Code', element.dataset.codePath ?? '연결 필요'],
      ['Storybook', element.dataset.storybookPath ?? '연결 필요'],
    ],
  };
}

function Section({
  id,
  eyebrow,
  title,
  description,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-16">
      <p className="text-neutral-60 mb-2 px-1 text-xs font-semibold">{title}</p>
      <div className="border-border-subtle overflow-hidden rounded-sm border bg-white shadow-[0_18px_40px_rgb(0_0_0_/_18%)]">
        <div className="border-border-subtle border-b px-5 py-6 md:px-8 lg:px-10">
          <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
            <div className="space-y-2">
              <p className="text-action-tertiary-fg text-sm font-semibold">
                {eyebrow}
              </p>
              <h2 className="text-text-strong text-2xl font-bold">{title}</h2>
            </div>
            <p className="text-text-secondary max-w-4xl text-sm leading-6">
              {description}
            </p>
          </div>
        </div>
        <div className="min-w-0 px-5 py-6 md:px-8 md:py-8 lg:px-10">
          {children}
        </div>
      </div>
    </section>
  );
}

function FigmaTopBar({
  isPreviewMode,
  isSidebarVisible,
  zoom,
  shareStatus,
  onTogglePreviewMode,
  onToggleSidebar,
  onGoHome,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onShareCurrentSection,
}: {
  isPreviewMode: boolean;
  isSidebarVisible: boolean;
  zoom: number;
  shareStatus: string;
  onTogglePreviewMode: () => void;
  onToggleSidebar: () => void;
  onGoHome: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onShareCurrentSection: () => void;
}) {
  return (
    <div className="sticky top-0 z-50 flex h-9 items-center justify-between border-b border-[#3f3f3f] bg-[#303030] text-white">
      <div className="flex h-full min-w-0 items-center">
        <button
          type="button"
          data-design-action="toggle-sidebar"
          onClick={onToggleSidebar}
          className="flex h-full w-12 items-center justify-center border-r border-[#3f3f3f] hover:bg-white/10"
          aria-label={isSidebarVisible ? '좌측 패널 접기' : '좌측 패널 열기'}
          title={isSidebarVisible ? '좌측 패널 접기' : '좌측 패널 열기'}
        >
          {isSidebarVisible ? (
            <PanelLeftClose
              className="text-neutral-80 h-4 w-4"
              aria-hidden="true"
            />
          ) : (
            <PanelLeftOpen
              className="text-neutral-80 h-4 w-4"
              aria-hidden="true"
            />
          )}
        </button>
        <div className="flex h-full min-w-0 items-center gap-2 border-r border-[#3f3f3f] bg-[#242424] px-4">
          <Image
            src="/logo_favicon/favicon_v2_green.svg"
            alt="모두의식물"
            width={18}
            height={18}
            className="h-4 w-4"
          />
          <span className="truncate text-sm font-semibold">모두의식물</span>
        </div>
        <button
          type="button"
          data-design-action="go-home"
          onClick={onGoHome}
          className="text-neutral-70 flex h-full w-10 items-center justify-center hover:bg-white/10"
          aria-label="처음 화면으로 이동"
          title="처음 화면으로 이동"
        >
          <Home className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <div className="flex h-full items-center gap-2 px-3">
        <div className="hidden h-7 items-center overflow-hidden rounded-md border border-[#3f3f3f] text-xs text-white md:flex">
          <button
            type="button"
            data-design-action="zoom-out"
            onClick={onZoomOut}
            className="flex h-full w-8 items-center justify-center hover:bg-white/10"
            aria-label="축소"
            title="축소"
          >
            <Minus className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            data-design-action="zoom-reset"
            onClick={onResetZoom}
            className="h-full min-w-12 border-x border-[#3f3f3f] px-2 font-semibold hover:bg-white/10"
            aria-label="줌 초기화"
            title="줌 초기화"
          >
            {zoom}%
          </button>
          <button
            type="button"
            data-design-action="zoom-in"
            onClick={onZoomIn}
            className="flex h-full w-8 items-center justify-center hover:bg-white/10"
            aria-label="확대"
            title="확대"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
        <button
          type="button"
          data-design-action="toggle-preview"
          onClick={onTogglePreviewMode}
          className={`flex h-7 items-center gap-1 rounded px-2 text-xs font-semibold hover:bg-white/10 ${
            isPreviewMode ? 'bg-white/10 text-white' : 'text-white'
          }`}
          aria-label={isPreviewMode ? '편집 패널 보기' : '미리보기'}
          title={isPreviewMode ? '편집 패널 보기' : '미리보기'}
        >
          <Play className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">
            {isPreviewMode ? '편집' : '프리뷰'}
          </span>
        </button>
        <button
          type="button"
          data-design-action="share-section"
          onClick={onShareCurrentSection}
          className="inline-flex h-7 items-center gap-1 rounded-md bg-[#0d99ff] px-3 text-xs font-semibold text-white hover:bg-[#007be5]"
          aria-label="현재 섹션 링크 복사"
          title="현재 섹션 링크 복사"
        >
          <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
          {shareStatus || '공유하기'}
        </button>
      </div>
    </div>
  );
}

function DesignSystemSidebar({
  selectedNodeId,
  layerSearchQuery,
  filteredLayerItems,
  onSelectNode,
  onLayerSearchChange,
}: {
  selectedNodeId: InspectorNodeId;
  layerSearchQuery: string;
  filteredLayerItems: typeof sidebarLayerItems;
  onSelectNode: (id: InspectorNodeId) => void;
  onLayerSearchChange: (query: string) => void;
}) {
  return (
    <aside className="hidden border-r border-[#3f3f3f] bg-[#2b2b2b] text-white lg:block">
      <div className="sticky top-9 h-[calc(100vh-36px)] overflow-y-auto">
        <div className="flex h-12 items-center justify-between border-b border-[#3f3f3f] px-4">
          <button
            type="button"
            className="inline-flex min-w-0 items-center gap-2 text-sm font-semibold"
          >
            <span className="truncate">모두의식물</span>
            <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          <PanelRight className="text-neutral-70 h-4 w-4" aria-hidden="true" />
        </div>

        <div className="border-b border-[#3f3f3f] p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-bold">페이지</p>
            <Search className="text-neutral-70 h-4 w-4" aria-hidden="true" />
          </div>
          <label className="relative mb-3 block">
            <span className="sr-only">레이어 검색</span>
            <Search
              className="text-neutral-70 pointer-events-none absolute top-1/2 left-2 h-3.5 w-3.5 -translate-y-1/2"
              aria-hidden="true"
            />
            <input
              data-design-action="layer-search"
              value={layerSearchQuery}
              onChange={(event) => onLayerSearchChange(event.target.value)}
              placeholder="레이어 검색"
              className="placeholder:text-neutral-60 w-full rounded-md border border-[#3f3f3f] bg-[#242424] py-1.5 pr-2 pl-7 text-xs text-white outline-none focus:border-[#0d99ff]"
            />
          </label>
          <div className="space-y-1 text-sm">
            <Link
              href="#logo"
              onClick={() => onSelectNode('logo')}
              className={`block rounded-md px-2 py-1.5 hover:bg-white/10 ${
                selectedNodeId === 'logo'
                  ? 'bg-[#52628a] font-semibold text-white'
                  : 'text-neutral-90'
              }`}
            >
              로고
            </Link>
            <Link
              href="#color"
              onClick={() => onSelectNode('color')}
              className={`block rounded-md px-2 py-1.5 hover:bg-white/10 ${
                selectedNodeId === 'color' ||
                selectedNodeId === 'typography' ||
                selectedNodeId === 'layout' ||
                selectedNodeId === 'layout-pc' ||
                selectedNodeId === 'layout-tablet' ||
                selectedNodeId === 'layout-mobile' ||
                selectedNodeId === 'image' ||
                selectedNodeId === 'image-basic-01' ||
                selectedNodeId === 'image-basic-02' ||
                selectedNodeId === 'image-photo-01' ||
                selectedNodeId === 'image-photo-02'
                  ? 'bg-white/10 font-semibold text-white'
                  : 'text-neutral-90'
              }`}
            >
              디자인 가이드 & 컴포넌트
            </Link>
          </div>
        </div>

        <div className="border-b border-[#3f3f3f] p-4">
          <div className="space-y-1 text-sm">
            {['백업', 'MVP 1차', 'MVP 2차', 'MVP 3차'].map((item) => (
              <p
                key={item}
                className="text-neutral-90 flex items-center justify-between rounded-md px-2 py-1.5"
              >
                {item}
                {item === 'MVP 2차' ? (
                  <Code2 className="h-3.5 w-3.5 text-[#86efac]" />
                ) : null}
              </p>
            ))}
          </div>
        </div>

        <div className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-bold">레이어</p>
            <Layers className="text-neutral-70 h-4 w-4" aria-hidden="true" />
          </div>
          <nav aria-label="Design system sections" className="space-y-1">
            {filteredLayerItems.length === 0 ? (
              <p className="text-neutral-60 rounded-md border border-[#3f3f3f] px-3 py-3 text-xs leading-5">
                검색 결과가 없습니다.
              </p>
            ) : null}
            {filteredLayerItems.map((item) => {
              const node = findInspectorNode(item.id);
              const isSelected = selectedNodeId === item.id;

              return (
                <Link
                  key={item.id}
                  href={node.href}
                  data-layer-id={item.id}
                  onClick={() => onSelectNode(item.id)}
                  className={`focus-visible:ring-focus-ring flex items-start gap-2 rounded-md py-2 pr-2 transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:outline-none ${
                    isSelected ? 'bg-[#52628a] text-white' : 'text-neutral-90'
                  }`}
                  style={{ paddingLeft: `${8 + item.depth * 18}px` }}
                >
                  <FileText
                    className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${
                      isSelected ? 'text-[#c6d3ff]' : 'text-neutral-70'
                    }`}
                    aria-hidden="true"
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">
                      {item.label}
                    </span>
                    <span className="text-neutral-60 block truncate text-xs">
                      {item.meta}
                    </span>
                  </span>
                </Link>
              );
            })}
          </nav>
          <div className="mt-4 border-t border-[#3f3f3f] pt-4">
            <p className="text-neutral-60 mb-2 px-2 text-xs font-semibold">
              다음 정리 예정
            </p>
            <div className="space-y-1">
              {futureNavItems.map((item) => (
                <p key={item} className="text-neutral-70 px-2 py-1 text-xs">
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function InspectorRows({
  rows,
  copiedValue,
  onCopy,
}: {
  rows: readonly (readonly [string, string])[];
  copiedValue?: string;
  onCopy?: (value: string) => void;
}) {
  return (
    <dl className="grid grid-cols-[92px_minmax(0,1fr)] gap-y-2 text-xs">
      {rows.map(([label, value]) => (
        <div key={`${label}-${value}`} className="contents">
          <dt className="text-neutral-70">{label}</dt>
          <dd className="group flex min-w-0 items-start justify-between gap-2 break-words text-white">
            <span className="min-w-0 break-words">{value}</span>
            {onCopy ? (
              <button
                type="button"
                onClick={() => onCopy(value)}
                className="text-neutral-70 shrink-0 rounded p-0.5 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white/10 hover:text-white focus-visible:opacity-100"
                aria-label={`${label} 값 복사`}
                title={`${label} 값 복사`}
              >
                {copiedValue === value ? (
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                )}
              </button>
            ) : null}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function InspectorPanel({
  node,
  componentInspection,
  zoom,
  activeTab,
  comments,
  commentDraft,
  copiedValue,
  onActiveTabChange,
  onCommentDraftChange,
  onAddComment,
  onDeleteComment,
  onCopy,
}: {
  node: InspectorNode;
  componentInspection: ComponentInspection | null;
  zoom: number;
  activeTab: InspectorTab;
  comments: readonly string[];
  commentDraft: string;
  copiedValue: string;
  onActiveTabChange: (tab: InspectorTab) => void;
  onCommentDraftChange: (value: string) => void;
  onAddComment: () => void;
  onDeleteComment: (index: number) => void;
  onCopy: (value: string) => void;
}) {
  return (
    <aside className="hidden border-l border-[#3f3f3f] bg-[#2b2b2b] text-white xl:block">
      <div className="sticky top-9 h-[calc(100vh-36px)] overflow-y-auto">
        <div className="flex h-16 items-center justify-between border-b border-[#3f3f3f] px-4">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#db5b22] text-xs font-bold">
              Y
            </span>
            <ChevronDown className="text-neutral-70 h-3.5 w-3.5" />
          </div>
          <span className="text-neutral-70 text-xs">{zoom}%</span>
        </div>

        <div className="border-b border-[#3f3f3f] px-4 py-3">
          <div className="flex gap-2 text-xs">
            <button
              type="button"
              onClick={() => onActiveTabChange('comments')}
              className={`rounded px-2 py-1 ${
                activeTab === 'comments'
                  ? 'bg-white/10 font-semibold text-white'
                  : 'text-neutral-70 hover:bg-white/10 hover:text-white'
              }`}
            >
              댓글
            </button>
            <button
              type="button"
              onClick={() => onActiveTabChange('properties')}
              className={`rounded px-2 py-1 ${
                activeTab === 'properties'
                  ? 'bg-white/10 font-semibold text-white'
                  : 'text-neutral-70 hover:bg-white/10 hover:text-white'
              }`}
            >
              속성
            </button>
          </div>
        </div>

        {activeTab === 'comments' ? (
          <div className="space-y-4 px-4 py-5 text-sm">
            <div>
              <p className="mb-3 text-xs font-bold text-white">댓글</p>
              <div className="rounded-md border border-[#3f3f3f] bg-[#242424] p-3">
                <div className="flex items-start gap-2">
                  <MessageSquare
                    className="text-neutral-70 mt-0.5 h-4 w-4 shrink-0"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-sm font-semibold">{node.label}</p>
                    <p className="text-neutral-70 mt-1 text-xs leading-5">
                      현재 세션에서만 유지되는 작업 메모입니다. 서버 저장은 이후
                      파일 수정 API나 실제 백엔드에 연결하면 됩니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <label className="block">
              <span className="mb-2 block text-xs font-bold text-white">
                새 댓글
              </span>
              <textarea
                value={commentDraft}
                onChange={(event) =>
                  onCommentDraftChange(event.target.value.slice(0, 240))
                }
                placeholder="이 레이어에서 확인할 점을 적어주세요."
                className="placeholder:text-neutral-60 min-h-24 w-full resize-none rounded-md border border-[#3f3f3f] bg-[#242424] p-3 text-xs leading-5 text-white outline-none focus:border-[#0d99ff]"
              />
            </label>

            <button
              type="button"
              onClick={onAddComment}
              disabled={!commentDraft.trim()}
              className="disabled:text-neutral-60 inline-flex h-8 items-center rounded-md bg-[#0d99ff] px-3 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:bg-white/10"
            >
              댓글 추가
            </button>

            <div className="border-t border-[#3f3f3f] pt-4">
              <p className="mb-3 text-xs font-bold text-white">
                이 레이어의 댓글 {comments.length}개
              </p>
              {comments.length === 0 ? (
                <p className="text-neutral-70 rounded-md border border-[#3f3f3f] p-3 text-xs leading-5">
                  아직 댓글이 없습니다.
                </p>
              ) : (
                <ul className="space-y-2">
                  {comments.map((comment, index) => (
                    <li
                      key={`${comment}-${index}`}
                      className="rounded-md border border-[#3f3f3f] bg-[#242424] p-3"
                    >
                      <p className="text-xs leading-5 text-white">{comment}</p>
                      <button
                        type="button"
                        onClick={() => onDeleteComment(index)}
                        className="text-neutral-70 mt-2 text-xs hover:text-white"
                      >
                        삭제
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6 px-4 py-5 text-sm">
            {componentInspection ? (
              <div data-inspector-live-measurement>
                <p className="mb-3 text-xs font-bold text-white">
                  선택 컴포넌트
                </p>
                <div className="rounded-md border border-[#0d99ff]/60 bg-[#123047] p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">
                        {componentInspection.label}
                      </p>
                      <p className="text-neutral-70 mt-1 text-xs">
                        {componentInspection.kind}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onCopy(componentInspection.id)}
                      className="text-neutral-60 rounded border border-white/10 px-2 py-1 text-xs hover:bg-white/10 hover:text-white"
                    >
                      ID 복사
                    </button>
                  </div>
                  <p className="text-neutral-70 mt-2 text-xs leading-5">
                    {componentInspection.description}
                  </p>
                </div>

                <div className="mt-5">
                  <p className="mb-3 text-xs font-bold text-white">
                    실측 레이아웃
                  </p>
                  <InspectorRows
                    rows={componentInspection.layout}
                    copiedValue={copiedValue}
                    onCopy={onCopy}
                  />
                </div>

                <div className="mt-5 border-t border-[#3f3f3f] pt-5">
                  <p className="mb-3 text-xs font-bold text-white">스페이싱</p>
                  <InspectorRows
                    rows={componentInspection.spacing}
                    copiedValue={copiedValue}
                    onCopy={onCopy}
                  />
                </div>

                <div className="mt-5 border-t border-[#3f3f3f] pt-5">
                  <p className="mb-3 text-xs font-bold text-white">자식 간격</p>
                  <InspectorRows
                    rows={componentInspection.childSpacing}
                    copiedValue={copiedValue}
                    onCopy={onCopy}
                  />
                </div>

                <div className="mt-5 border-t border-[#3f3f3f] pt-5">
                  <p className="mb-3 text-xs font-bold text-white">
                    실측 타이포그래피
                  </p>
                  <InspectorRows
                    rows={componentInspection.typography}
                    copiedValue={copiedValue}
                    onCopy={onCopy}
                  />
                </div>

                <div className="mt-5 border-t border-[#3f3f3f] pt-5">
                  <p className="mb-3 text-xs font-bold text-white">실측 색상</p>
                  <div className="space-y-3">
                    {componentInspection.colors.map(([label, value]) => (
                      <div
                        key={`${label}-${value}`}
                        className="grid grid-cols-[92px_minmax(0,1fr)] items-center gap-y-2 text-xs"
                      >
                        <span className="text-neutral-70">{label}</span>
                        <button
                          type="button"
                          onClick={() => onCopy(value)}
                          className="group flex min-w-0 items-center gap-2 text-left break-words text-white"
                          aria-label={`${label} 색상값 복사`}
                          title={`${label} 색상값 복사`}
                        >
                          <span
                            className="h-3.5 w-3.5 shrink-0 rounded border border-white/10"
                            style={{
                              backgroundColor:
                                value.startsWith('#') ||
                                value.startsWith('rgb') ||
                                value.startsWith('hsl')
                                  ? value
                                  : '#3f3f3f',
                            }}
                          />
                          <span className="min-w-0 break-words">{value}</span>
                          {copiedValue === value ? (
                            <Check
                              className="text-neutral-70 h-3.5 w-3.5 shrink-0"
                              aria-hidden="true"
                            />
                          ) : (
                            <Copy
                              className="text-neutral-70 h-3.5 w-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                              aria-hidden="true"
                            />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 border-t border-[#3f3f3f] pt-5">
                  <p className="mb-3 text-xs font-bold text-white">실측 연결</p>
                  <InspectorRows
                    rows={componentInspection.links}
                    copiedValue={copiedValue}
                    onCopy={onCopy}
                  />
                </div>
              </div>
            ) : null}

            <div>
              <p className="mb-3 text-xs font-bold text-white">선택 프레임</p>
              <div className="rounded-md border border-[#3f3f3f] bg-[#242424] p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold" data-inspector-node>
                      {node.label}
                    </p>
                    <p className="text-neutral-70 mt-1 text-xs">{node.kind}</p>
                  </div>
                  <Link
                    href={node.href}
                    className="text-neutral-60 rounded border border-[#3f3f3f] px-2 py-1 text-xs hover:bg-white/10 hover:text-white"
                  >
                    이동
                  </Link>
                </div>
                <p className="text-neutral-70 mt-1 text-xs leading-5">
                  {node.description}
                </p>
              </div>
            </div>

            <div>
              <p className="mb-3 text-xs font-bold text-white">레이아웃</p>
              <InspectorRows
                rows={node.layout}
                copiedValue={copiedValue}
                onCopy={onCopy}
              />
            </div>

            <div className="border-t border-[#3f3f3f] pt-5">
              <p className="mb-3 text-xs font-bold text-white">콘텐츠</p>
              <InspectorRows
                rows={node.content}
                copiedValue={copiedValue}
                onCopy={onCopy}
              />
            </div>

            <div className="border-t border-[#3f3f3f] pt-5">
              <p className="mb-3 text-xs font-bold text-white">스타일</p>
              <InspectorRows
                rows={node.typography}
                copiedValue={copiedValue}
                onCopy={onCopy}
              />
            </div>

            <div className="border-t border-[#3f3f3f] pt-5">
              <p className="mb-3 text-xs font-bold text-white">색상</p>
              <div className="space-y-3">
                {node.colors.map(([label, value]) => (
                  <div
                    key={`${label}-${value}`}
                    className="grid grid-cols-[92px_minmax(0,1fr)] items-center gap-y-2 text-xs"
                  >
                    <span className="text-neutral-70">{label}</span>
                    <button
                      type="button"
                      onClick={() => onCopy(value)}
                      className="group flex min-w-0 items-center gap-2 text-left break-words text-white"
                      aria-label={`${label} 색상값 복사`}
                      title={`${label} 색상값 복사`}
                    >
                      <span
                        className="h-3.5 w-3.5 shrink-0 rounded border border-white/10"
                        style={{
                          backgroundColor: value.startsWith('#')
                            ? value
                            : '#3f3f3f',
                        }}
                      />
                      <span className="min-w-0 break-words">{value}</span>
                      {copiedValue === value ? (
                        <Check
                          className="text-neutral-70 h-3.5 w-3.5 shrink-0"
                          aria-hidden="true"
                        />
                      ) : (
                        <Copy
                          className="text-neutral-70 h-3.5 w-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-[#3f3f3f] pt-5">
              <p className="mb-3 text-xs font-bold text-white">연결</p>
              <InspectorRows
                rows={node.links}
                copiedValue={copiedValue}
                onCopy={onCopy}
              />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

function StatusPill({ status }: { status: 'synced' | 'check' | 'code' }) {
  const label = {
    synced: 'matched',
    check: '확인 필요',
    code: 'code only',
  }[status];

  return (
    <span className="border-border-subtle text-text-muted inline-flex rounded-full border px-2 py-0.5 text-[11px] leading-4 font-semibold">
      {label}
    </span>
  );
}

function NameMappingStatus({
  status,
}: {
  status: 'matched' | 'renamed' | 'needsDecision' | 'codeOnly' | 'archived';
}) {
  const statusConfig = {
    matched: {
      label: '값/역할 일치',
      className:
        'border-primary-20 bg-action-tertiary-hover text-action-tertiary-fg',
    },
    renamed: {
      label: '이름 다름',
      className: 'border-border-subtle bg-surface-muted text-text-secondary',
    },
    needsDecision: {
      label: '결정 필요',
      className: 'border-system-alert bg-surface-card text-feedback-error',
    },
    codeOnly: {
      label: '코드만 있음',
      className: 'border-border-subtle bg-surface-muted text-text-muted',
    },
    archived: {
      label: '미사용/보관',
      className: 'border-border-subtle bg-surface-muted text-text-muted',
    },
  }[status];

  return (
    <span
      className={`${statusConfig.className} inline-flex rounded-full border px-2 py-0.5 text-[11px] leading-4 font-semibold`}
    >
      {statusConfig.label}
    </span>
  );
}

function Swatch({
  figmaName,
  token,
  value,
  role,
  status,
}: {
  figmaName: string;
  token: string;
  value: string;
  role: string;
  status: 'synced' | 'check' | 'code';
}) {
  return (
    <div className="border-border-subtle bg-surface-card overflow-hidden rounded-lg border">
      <div className="h-16" style={{ backgroundColor: value }} />
      <div className="space-y-1 px-3 py-3">
        <div className="flex items-start justify-between gap-2">
          <p className="text-text-strong text-sm font-semibold">{figmaName}</p>
          <StatusPill status={status} />
        </div>
        <p className="text-text-muted text-xs">{token}</p>
        <p className="text-text-secondary text-xs">{value}</p>
        <p className="text-text-muted text-xs leading-5">{role}</p>
      </div>
    </div>
  );
}

function ColorGroup({
  title,
  description,
  colors,
}: {
  title: string;
  description: string;
  colors: readonly {
    figmaName: string;
    token: string;
    value: string;
    role: string;
    status: 'synced' | 'check' | 'code';
  }[];
}) {
  return (
    <div>
      <div className="mb-4 space-y-1">
        <h3 className="text-text-strong text-lg font-semibold">{title}</h3>
        <p className="text-text-secondary text-sm leading-6">{description}</p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {colors.map((color) => (
          <Swatch key={`${title}-${color.figmaName}`} {...color} />
        ))}
      </div>
    </div>
  );
}

function LogoCard({ asset }: { asset: (typeof logoAssets)[number] }) {
  const surfaceClass = {
    light: 'bg-surface-card',
    dark: 'bg-neutral-20',
    brand: 'bg-action-primary-bg',
  }[asset.surface];

  return (
    <div className="border-border-subtle overflow-hidden rounded-lg border">
      <div
        className={`${surfaceClass} flex h-36 items-center justify-center p-6`}
      >
        <Image
          src={asset.path}
          alt={asset.name}
          width={asset.width}
          height={asset.height}
          className="max-h-20 w-auto max-w-full"
          priority={asset.name === 'Logo v2 / Green'}
        />
      </div>
      <div className="bg-surface-card space-y-1 px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <p className="text-text-strong text-sm font-semibold">{asset.name}</p>
          <span className="border-border-subtle text-text-muted shrink-0 rounded-full border px-2 py-0.5 text-[11px] leading-4 font-semibold">
            {asset.status}
          </span>
        </div>
        <p className="text-text-secondary text-xs">{asset.usage}</p>
        <p className="text-text-muted text-xs">{asset.path}</p>
      </div>
    </div>
  );
}

function LogoSystemPreview() {
  return (
    <div className="space-y-5">
      <div className="border-border-subtle bg-surface-card overflow-hidden rounded-lg border">
        <div className="border-border-subtle border-b p-4">
          <h3 className="text-text-strong text-lg font-semibold">
            로고 시스템 가이드
          </h3>
          <p className="text-text-secondary mt-1 text-sm leading-6">
            Figma 이미지처럼 Symbol, Logo & Favicon, Typography를 나누되, 운영
            페이지에서는 통짜 캡처가 아니라 실제 SVG 자산과 후보 자산의 관계로
            정리합니다.
          </p>
        </div>
        <div className="space-y-5 p-4">
          <LogoTypographyGuide />
          <LogoSymbolGuide
            title="Type A / Symbol"
            description="현재 서비스에서 쓰는 v2 계열입니다. 신규 화면과 Storybook 문서는 이 세트를 기본으로 봅니다."
            variant="typeA"
          />
          <LogoFaviconGuide
            title="Type A / Logo & Favicon"
            description="앱 아이콘, 브라우저 탭, 서비스 헤더에서 쓰는 compact mark 기준입니다."
            variant="typeA"
          />
          <LogoSymbolGuide
            title="Type B / Symbol"
            description="Figma에는 존재하지만 현재 코드의 runtime logo 자산에는 연결되지 않은 후보안입니다."
            variant="typeB"
          />
          <LogoFaviconGuide
            title="Type B / Logo & Favicon"
            description="Type B를 채택하려면 개별 SVG 자산을 추출한 뒤 코드 경로와 Storybook에 추가해야 합니다."
            variant="typeB"
          />
        </div>
      </div>
    </div>
  );
}

function LogoTypographyGuide() {
  return (
    <div className="bg-surface-muted overflow-hidden rounded-lg">
      <div className="grid gap-6 bg-white p-5 md:p-6 lg:grid-cols-[160px_minmax(0,1fr)] lg:p-8">
        <div className="space-y-8">
          <h4 className="text-text-strong text-2xl font-bold lg:text-3xl">
            Typography
          </h4>
          <div className="space-y-6 text-base leading-7">
            <div>
              <p className="text-text-strong font-bold">국문</p>
              <p className="text-text-secondary">나눔스퀘어 라운드</p>
            </div>
            <div>
              <p className="text-text-strong font-bold">영문</p>
              <p className="text-text-secondary">Fredoka</p>
            </div>
          </div>
        </div>
        <div className="bg-surface-muted grid overflow-hidden sm:grid-cols-2">
          <LogoWordmarkTile
            label="Korean black wordmark"
            src="/logo_favicon/Logo_v2_black.svg"
            surface="light"
          />
          <LogoWordmarkTile
            label="Korean white wordmark"
            src="/logo_favicon/Logo_v2_white.svg"
            surface="green"
          />
          <LogoWordmarkTile
            label="English white wordmark"
            text="ModusPlant"
            surface="green"
          />
          <LogoWordmarkTile
            label="English black wordmark"
            text="ModusPlant"
            surface="light"
          />
        </div>
      </div>
    </div>
  );
}

function LogoSymbolGuide({
  title,
  description,
  variant,
}: {
  title: string;
  description: string;
  variant: 'typeA' | 'typeB';
}) {
  const isTypeA = variant === 'typeA';

  return (
    <div className="bg-surface-muted overflow-hidden rounded-lg">
      <div className="bg-white p-5 md:p-6 lg:p-8">
        <div className="mb-10 space-y-2">
          <h4 className="text-text-strong text-2xl font-bold lg:text-3xl">
            Symbol
          </h4>
          <p className="text-text-secondary max-w-2xl text-sm leading-6">
            {title} · {description}
          </p>
        </div>
        {isTypeA ? <TypeASymbolSet /> : <TypeBSymbolSet />}
      </div>
    </div>
  );
}

function TypeASymbolSet() {
  return (
    <div className="grid gap-x-8 gap-y-10 md:grid-cols-2 2xl:grid-cols-4">
      <div className="bg-neutral-10 flex min-h-36 items-center justify-center p-8">
        <Image
          src="/logo_favicon/favicon_v2_green.svg"
          alt="Type A symbol on dark background"
          width={88}
          height={88}
          className="h-16 w-16"
        />
      </div>
      <div className="flex min-h-36 items-center justify-center p-8">
        <Image
          src="/logo_favicon/favicon_v2_green.svg"
          alt="Type A symbol"
          width={88}
          height={88}
          className="h-16 w-16"
        />
      </div>
      <div className="bg-action-primary-bg flex min-h-36 items-center justify-center p-8">
        <Image
          src="/logo_favicon/Logo_v2_white.svg"
          alt="Type A white logo on green background"
          width={214}
          height={46}
          className="h-auto w-44"
        />
      </div>
      <div className="flex min-h-36 items-center justify-center p-8">
        <Image
          src="/logo_favicon/Logo_v2_green.svg"
          alt="Type A green logo"
          width={274}
          height={56}
          className="h-auto w-48"
        />
      </div>
      <div className="flex min-h-20 items-center justify-center p-4">
        <Image
          src="/logo_favicon/Logo_v2_green.svg"
          alt="Type A green horizontal logo"
          width={274}
          height={56}
          className="h-auto w-52"
        />
      </div>
      <div className="flex min-h-20 items-center justify-center p-4">
        <Image
          src="/logo_favicon/Logo_v2_black.svg"
          alt="Type A black horizontal logo"
          width={214}
          height={46}
          className="h-auto w-48"
        />
      </div>
      <div className="flex min-h-20 items-center justify-center p-4">
        <span className="text-text-strong text-2xl font-bold whitespace-nowrap 2xl:text-3xl">
          모두의식물
        </span>
      </div>
      <div className="flex min-h-20 items-center justify-center p-4">
        <span className="text-text-strong text-2xl font-bold whitespace-nowrap 2xl:text-3xl">
          ModusPlant
        </span>
      </div>
    </div>
  );
}

function TypeBSymbolSet() {
  return (
    <div className="grid gap-x-8 gap-y-10 md:grid-cols-2 2xl:grid-cols-4">
      <FigmaVectorCrop
        label="dark symbol"
        src={figmaLogoAsset.typeBSymbol}
        viewBox="140 472 402 212"
        className="min-h-36"
      />
      <FigmaVectorCrop
        label="symbol"
        src={figmaLogoAsset.typeBSymbol}
        viewBox="650 500 210 180"
        className="min-h-36"
      />
      <FigmaVectorCrop
        label="white lockup"
        src={figmaLogoAsset.typeBSymbol}
        viewBox="960 472 405 212"
        className="min-h-36"
      />
      <FigmaVectorCrop
        label="green lockup"
        src={figmaLogoAsset.typeBSymbol}
        viewBox="1410 500 360 180"
        className="min-h-36"
      />
      <FigmaVectorCrop
        label="green horizontal logo"
        src={figmaLogoAsset.typeBSymbol}
        viewBox="170 760 360 120"
        className="min-h-20"
      />
      <FigmaVectorCrop
        label="black icon lockup"
        src={figmaLogoAsset.typeBSymbol}
        viewBox="610 760 360 120"
        className="min-h-20"
      />
      <FigmaVectorCrop
        label="black wordmark"
        src={figmaLogoAsset.typeBSymbol}
        viewBox="1060 760 280 120"
        className="min-h-20"
      />
      <FigmaVectorCrop
        label="English wordmark"
        src={figmaLogoAsset.typeBSymbol}
        viewBox="1440 760 320 120"
        className="min-h-20"
      />
    </div>
  );
}

function LogoFaviconGuide({
  title,
  description,
  variant,
}: {
  title: string;
  description: string;
  variant: 'typeA' | 'typeB';
}) {
  const isTypeA = variant === 'typeA';

  return (
    <div className="bg-surface-muted overflow-hidden rounded-lg">
      <div className="grid gap-6 bg-white p-5 md:p-6 lg:grid-cols-[160px_minmax(0,1fr)] lg:p-8">
        <div className="space-y-3">
          <h4 className="text-text-strong text-2xl leading-tight font-bold lg:text-3xl">
            Logo &<br />
            Favicon
          </h4>
          <p className="text-text-secondary text-sm leading-6">
            {title} · {description}
          </p>
        </div>
        {isTypeA ? <TypeAFaviconSet /> : <TypeBFaviconSet />}
      </div>
    </div>
  );
}

function TypeAFaviconSet() {
  return (
    <div className="grid gap-3 xl:grid-cols-[1fr_0.58fr_1fr]">
      <div className="bg-surface-muted flex min-h-56 items-center justify-center gap-5 p-8">
        {[
          'rounded-none shadow-[0_14px_24px_rgb(0_0_0_/_18%)]',
          'rounded-2xl shadow-[0_14px_24px_rgb(0_0_0_/_18%)]',
          'rounded-full shadow-[0_14px_24px_rgb(0_0_0_/_18%)]',
        ].map((className) => (
          <div
            key={className}
            className={`bg-action-primary-bg flex h-16 w-16 items-center justify-center overflow-hidden ${className}`}
          >
            <Image
              src="/logo_favicon/favicon_v2_white.svg"
              alt="Type A favicon shape"
              width={56}
              height={56}
              className="h-11 w-11"
            />
          </div>
        ))}
      </div>
      <BrowserTabMock logoSrc="/logo_favicon/favicon_v2_green.svg" />
      <div className="bg-surface-muted flex min-h-56 items-center justify-center p-8">
        <div className="border-border-muted relative h-32 w-32 rounded-[28px] border">
          <div className="border-border-muted absolute inset-x-0 top-1/2 border-t" />
          <div className="border-border-muted absolute inset-y-0 left-1/2 border-l" />
          <div className="border-border-muted absolute inset-4 rounded-[22px] border" />
          <Image
            src="/logo_favicon/favicon_v2_white.svg"
            alt="Type A icon grid"
            width={56}
            height={56}
            className="absolute top-1/2 left-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2"
          />
        </div>
      </div>
      <DockPreview logoSrc="/logo_favicon/favicon_v2_white.svg" />
      <PhoneDockPreview logoSrc="/logo_favicon/favicon_v2_white.svg" />
    </div>
  );
}

function TypeBFaviconSet() {
  return (
    <div className="grid gap-3 xl:grid-cols-[1fr_0.58fr_1fr]">
      <FigmaVectorCrop
        label="Type B app icon shape"
        src={figmaLogoAsset.typeBLogoFavicon}
        viewBox="641 140 432 344"
        className="min-h-56"
      />
      <FigmaVectorCrop
        label="Type B browser tab"
        src={figmaLogoAsset.typeBLogoFavicon}
        viewBox="1074 140 260 344"
        className="min-h-56"
      />
      <FigmaVectorCrop
        label="Type B icon grid"
        src={figmaLogoAsset.typeBLogoFavicon}
        viewBox="1348 140 432 344"
        className="min-h-56"
      />
      <FigmaVectorCrop
        label="Type B desktop dock"
        src={figmaLogoAsset.typeBLogoFavicon}
        viewBox="641 494 568 446"
        className="min-h-72"
      />
      <FigmaVectorCrop
        label="Type B phone dock"
        src={figmaLogoAsset.typeBLogoFavicon}
        viewBox="1217 494 563 446"
        className="min-h-72"
      />
    </div>
  );
}

function LogoWordmarkTile({
  label,
  src,
  text,
  surface,
}: {
  label: string;
  src?: string;
  text?: string;
  surface: 'light' | 'green';
}) {
  return (
    <div
      className={`flex min-h-32 items-center justify-center p-5 lg:min-h-36 ${
        surface === 'green' ? 'bg-action-primary-bg' : 'bg-white'
      }`}
      aria-label={label}
    >
      {src ? (
        <Image
          src={src}
          alt={label}
          width={274}
          height={56}
          className="h-auto w-44 max-w-full"
        />
      ) : (
        <span
          className={`text-3xl font-bold ${
            surface === 'green' ? 'text-white' : 'text-text-strong'
          }`}
        >
          {text}
        </span>
      )}
    </div>
  );
}

function FigmaVectorCrop({
  label,
  src,
  viewBox,
  className = '',
}: {
  label: string;
  src: string;
  viewBox: string;
  className?: string;
}) {
  const [x = 0, y = 0, width = 1920, height = 1080] = viewBox
    .split(/\s+/)
    .map(Number);

  return (
    <div
      className={`bg-surface-muted flex items-center justify-center overflow-hidden ${className}`}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={label}
        className="h-auto w-full"
        overflow="hidden"
      >
        <image href={src} x={-x} y={-y} width="1920" height="1080" />
      </svg>
    </div>
  );
}

function BrowserTabMock({ logoSrc }: { logoSrc: string }) {
  return (
    <div className="bg-surface-muted flex min-h-56 items-center justify-center p-8">
      <div className="border-border-muted w-full max-w-52 rounded-t-2xl border bg-white shadow-sm">
        <div className="border-border-muted flex items-center gap-2 border-b px-4 py-3">
          <span className="bg-neutral-80 h-2 w-2 rounded-full" />
          <span className="bg-neutral-80 h-2 w-2 rounded-full" />
          <span className="bg-neutral-80 h-2 w-2 rounded-full" />
        </div>
        <div className="flex items-center gap-2 px-4 py-3">
          <Image
            src={logoSrc}
            alt="browser favicon"
            width={88}
            height={88}
            className="h-6 w-6"
          />
          <span className="text-text-strong truncate text-sm">Modusplant</span>
        </div>
      </div>
    </div>
  );
}

function DockPreview({ logoSrc }: { logoSrc: string }) {
  return (
    <div className="bg-surface-muted col-span-1 flex min-h-72 items-end justify-center overflow-hidden p-10 xl:col-span-2">
      <div className="flex w-full max-w-xl items-center gap-5 rounded-[28px] bg-white/45 p-4 shadow-[0_10px_30px_rgb(83_50_121_/_0.28)] backdrop-blur">
        {['bg-neutral-70', 'bg-sky-500', 'bg-blue-400'].map((className) => (
          <span
            key={className}
            className={`${className} block h-16 w-16 rounded-2xl`}
          />
        ))}
        <span className="bg-action-primary-bg flex h-16 w-16 items-center justify-center rounded-2xl">
          <Image
            src={logoSrc}
            alt="desktop dock favicon"
            width={56}
            height={56}
            className="h-11 w-11"
          />
        </span>
      </div>
    </div>
  );
}

function PhoneDockPreview({ logoSrc }: { logoSrc: string }) {
  return (
    <div className="bg-surface-muted flex min-h-72 items-end justify-center overflow-hidden p-10">
      <div className="border-neutral-20 rounded-[32px] border-8 bg-[#211068] p-8 shadow-lg">
        <div className="flex gap-4 rounded-[24px] bg-white/20 p-4">
          <span className="bg-action-primary-bg flex h-16 w-16 items-center justify-center rounded-2xl">
            <Image
              src={logoSrc}
              alt="phone dock favicon"
              width={56}
              height={56}
              className="h-11 w-11"
            />
          </span>
          <span className="h-16 w-16 rounded-2xl bg-green-300" />
          <span className="h-16 w-16 rounded-2xl bg-green-200" />
        </div>
      </div>
    </div>
  );
}

function TypographySourcePreview() {
  return (
    <div className="border-border-subtle overflow-hidden rounded-lg border">
      <div className="bg-surface-card flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-text-strong text-lg font-semibold">
            Figma 02.Typography 원본
          </h3>
          <p className="text-text-secondary mt-1 text-sm leading-6">
            전달받은 export는 보관하고, 아래 표에서는 운영 코드 기준으로 다시
            정리합니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            ['SVG', figmaTypographyAsset.svg],
            ['PDF', figmaTypographyAsset.pdf],
            ['PNG', figmaTypographyAsset.png],
          ].map(([label, href]) => (
            <Link
              key={label}
              href={href}
              target="_blank"
              className="border-action-tertiary-border text-action-tertiary-fg hover:bg-action-tertiary-hover focus-visible:ring-focus-ring inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              {label}
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </div>
      <div className="border-border-subtle bg-surface-muted max-h-[720px] overflow-auto border-t p-4">
        <Image
          src={figmaTypographyAsset.svg}
          alt="Figma 02.Typography guide export"
          width={1342}
          height={1905}
          className="mx-auto h-auto max-w-full min-w-[760px] rounded-lg bg-white"
        />
      </div>
    </div>
  );
}

function TypographySystemGuide() {
  return (
    <div className="border-border-subtle overflow-hidden rounded-lg border">
      <div className="bg-surface-card border-border-subtle border-b p-4">
        <h3 className="text-text-strong text-lg font-semibold">
          Typography 시스템
        </h3>
        <p className="text-text-secondary mt-1 text-sm leading-6">
          Figma의 폰트 역할을 현재 코드의 font family, utility, Storybook
          기준으로 연결합니다.
        </p>
      </div>

      <div className="grid gap-4 p-4 lg:grid-cols-2">
        {typographyFamilyRows.map((row) => (
          <div
            key={row.figmaName}
            className="border-border-subtle rounded-lg border p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-text-muted text-xs font-semibold">
                  {row.role}
                </p>
                <h4 className="text-text-strong mt-1 text-lg font-bold">
                  {row.figmaName}
                </h4>
              </div>
              <NameMappingStatus status={row.status} />
            </div>
            <p className="text-text-secondary mt-3 text-sm leading-6">
              {row.usage}
            </p>
            <p className="text-text-muted mt-3 text-xs">{row.codeName}</p>
            <p className="text-text-secondary mt-3 text-xs leading-5">
              {row.note}
            </p>
          </div>
        ))}
      </div>

      <div className="border-border-subtle border-t p-4">
        <div className="bg-surface-muted overflow-hidden rounded-lg">
          <div className="grid gap-6 bg-white p-5 md:p-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:p-8">
            <div className="space-y-3">
              <h4 className="text-text-strong text-2xl font-bold">
                Type Scale
              </h4>
              <p className="text-text-secondary text-sm leading-6">
                미리보기는 현재 코드 렌더링 기준입니다. Figma 자간 값은 표에
                보존하고, 라이브 샘플은 운영 UI 안정성을 위해 0px로 표시합니다.
              </p>
            </div>
            <div className="grid gap-3">
              {typographySpecRows.slice(0, 6).map((row) => (
                <TypographyPreviewRow key={row.figmaStyle} row={row} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TypographyPreviewRow({
  row,
}: {
  row: (typeof typographySpecRows)[number];
}) {
  return (
    <div className="border-border-subtle grid gap-3 rounded-lg border bg-white p-4 md:grid-cols-[190px_minmax(0,1fr)]">
      <div>
        <p className="text-text-strong text-sm font-semibold">
          {row.figmaStyle}
        </p>
        <p className="text-text-muted mt-1 text-xs">
          {row.size} / {row.weight} / {row.lineHeight}
        </p>
      </div>
      <p
        className="text-text-strong break-words"
        style={{
          fontFamily:
            row.family === 'emphasis'
              ? 'var(--font-emphasis)'
              : 'var(--font-body)',
          fontSize: row.size,
          fontWeight: row.weightValue,
          lineHeight: row.lineHeightValue,
          letterSpacing: '0px',
        }}
      >
        {row.sample}
      </p>
    </div>
  );
}

function TypographySpecTable() {
  return (
    <div className="border-border-subtle overflow-hidden rounded-lg border">
      <div className="bg-surface-card border-border-subtle border-b p-4">
        <h3 className="text-text-strong text-lg font-semibold">
          Figma 이름과 코드 이름 매핑
        </h3>
        <p className="text-text-secondary mt-1 text-sm leading-6">
          이미지에 보이는 text style을 그대로 옮기되, 현재 코드에 있는 utility와
          다른 부분을 상태로 표시했습니다.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1180px] text-left text-sm">
          <thead className="bg-surface-muted text-text-strong">
            <tr>
              <th className="px-4 py-3 font-semibold">Figma name</th>
              <th className="px-4 py-3 font-semibold">Figma style</th>
              <th className="px-4 py-3 font-semibold">Code name</th>
              <th className="px-4 py-3 font-semibold">Size / Weight</th>
              <th className="px-4 py-3 font-semibold">Line / Letter</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">메모</th>
            </tr>
          </thead>
          <tbody>
            {typographySpecRows.map((row) => (
              <tr
                key={row.figmaStyle}
                className="border-border-subtle border-t align-top"
              >
                <td className="px-4 py-3 font-medium">{row.figmaName}</td>
                <td className="text-text-secondary px-4 py-3">
                  {row.figmaStyle}
                </td>
                <td className="text-text-secondary px-4 py-3">
                  {row.codeName}
                </td>
                <td className="text-text-secondary px-4 py-3">
                  {row.size} / {row.weight}
                </td>
                <td className="text-text-secondary px-4 py-3">
                  {row.lineHeight} / Figma {row.figmaLetterSpacing}
                  <br />
                  <span className="text-text-muted">
                    Code {row.codeLetterSpacing}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <NameMappingStatus status={row.status} />
                </td>
                <td className="text-text-secondary px-4 py-3 leading-6">
                  {row.note}
                </td>
              </tr>
            ))}
            {typographyCodeOnlyRows.map((row) => (
              <tr
                key={row.codeName}
                className="border-border-subtle border-t align-top"
              >
                <td className="px-4 py-3 font-medium">{row.figmaName}</td>
                <td className="text-text-secondary px-4 py-3">-</td>
                <td className="text-text-secondary px-4 py-3">
                  {row.codeName}
                </td>
                <td className="text-text-secondary px-4 py-3">{row.value}</td>
                <td className="text-text-secondary px-4 py-3">code only</td>
                <td className="px-4 py-3">
                  <NameMappingStatus status="codeOnly" />
                </td>
                <td className="text-text-secondary px-4 py-3 leading-6">
                  {row.reason}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LayoutSourcePreview() {
  return (
    <div className="border-border-subtle overflow-hidden rounded-lg border">
      <div className="bg-surface-card flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-text-strong text-lg font-semibold">
            Figma 03.Layout 원본
          </h3>
          <p className="text-text-secondary mt-1 text-sm leading-6">
            export 원본은 보관하고, 운영 기준은 아래 breakpoint 카드와 코드 토큰
            후보로 나눠 관리합니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            ['SVG', figmaLayoutAsset.svg],
            ['PNG 2x', figmaLayoutAsset.png2x],
            ['PNG 3x', figmaLayoutAsset.png3x],
          ].map(([label, href]) => (
            <Link
              key={label}
              href={href}
              target="_blank"
              className="border-action-tertiary-border text-action-tertiary-fg hover:bg-action-tertiary-hover focus-visible:ring-focus-ring inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              {label}
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </div>
      <div className="border-border-subtle bg-surface-muted max-h-[720px] overflow-auto border-t p-4">
        <Image
          src={figmaLayoutAsset.svg}
          alt="Figma 03.Layout guide export"
          width={1342}
          height={2953}
          className="mx-auto h-auto max-w-full min-w-[760px] rounded-lg bg-white"
        />
      </div>
    </div>
  );
}

function LayoutGridPreview({ columns }: { columns: string }) {
  return (
    <div
      className="border-primary-30 bg-primary-10 grid h-28 rounded-md border"
      style={{
        gridTemplateColumns: `repeat(${Number(columns)}, minmax(0, 1fr))`,
        columnGap: '4px',
        padding: '0 14px',
      }}
    >
      {Array.from({ length: Number(columns) }, (_, index) => (
        <div key={index} className="bg-primary-20/80 h-full" />
      ))}
    </div>
  );
}

function LayoutSpecCards({
  onSelectNode,
}: {
  onSelectNode: (id: InspectorNodeId) => void;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {layoutRows.map((row) => (
        <button
          key={row.id}
          type="button"
          data-preview-id={row.id}
          onClick={() => onSelectNode(row.id)}
          className="border-border-subtle bg-surface-card hover:border-primary-30 focus-visible:ring-focus-ring rounded-lg border p-4 text-left transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <p className="text-text-strong text-base font-bold">
                {row.label}
              </p>
              <p className="text-action-tertiary-fg mt-1 text-sm font-semibold">
                {row.range}
              </p>
            </div>
            <span className="border-border-subtle text-text-muted rounded-full border px-2 py-0.5 text-[11px] leading-4 font-semibold">
              {row.columns} cols
            </span>
          </div>
          <LayoutGridPreview columns={row.columns} />
          <dl className="mt-4 grid grid-cols-[108px_minmax(0,1fr)] gap-y-2 text-xs">
            {[
              ['Content', row.contentArea],
              ['Gutter', row.gutter],
              ['Margin', row.margin],
            ].map(([label, value]) => (
              <div key={label} className="contents">
                <dt className="text-text-muted">{label}</dt>
                <dd className="text-text-secondary font-medium">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="text-text-secondary mt-4 text-xs leading-5">
            {row.note}
          </p>
        </button>
      ))}
    </div>
  );
}

function LayoutSourceTable() {
  return (
    <div className="border-border-subtle overflow-hidden rounded-lg border">
      <div className="bg-surface-card border-border-subtle border-b p-4">
        <h3 className="text-text-strong text-lg font-semibold">
          Layout export 보관 위치
        </h3>
        <p className="text-text-secondary mt-1 text-sm leading-6">
          Figma 원본 파일과 public asset 경로를 함께 두어 이후 AI 수정 기준으로
          추적합니다.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-surface-muted text-text-strong">
            <tr>
              <th className="px-4 py-3 font-semibold">Source</th>
              <th className="px-4 py-3 font-semibold">App path</th>
              <th className="px-4 py-3 font-semibold">Role</th>
              <th className="px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {layoutSourceRows.map((row) => (
              <tr key={row.source} className="border-border-subtle border-t">
                <td className="px-4 py-3 font-medium">{row.source}</td>
                <td className="text-text-secondary px-4 py-3">{row.appPath}</td>
                <td className="text-text-secondary px-4 py-3">{row.role}</td>
                <td className="text-text-secondary px-4 py-3">{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ImageSourcePreview() {
  return (
    <div className="border-border-subtle overflow-hidden rounded-lg border">
      <div className="bg-surface-card flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-text-strong text-lg font-semibold">
            Figma 04.Image 원본
          </h3>
          <p className="text-text-secondary mt-1 text-sm leading-6">
            큰 보드 원본은 비교용으로 보관하고, 운영 페이지에서는 개별 이미지
            후보를 따로 검토합니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            ['SVG', figmaImageAsset.svg],
            ['PDF', figmaImageAsset.pdf],
            ['PNG', figmaImageAsset.png],
          ].map(([label, href]) => (
            <Link
              key={label}
              href={href}
              target="_blank"
              className="border-action-tertiary-border text-action-tertiary-fg hover:bg-action-tertiary-hover focus-visible:ring-focus-ring inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              {label}
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </div>
      <div className="border-border-subtle bg-surface-muted overflow-auto border-t p-4">
        <Image
          src={figmaImageAsset.svg}
          alt="Figma 04.Image guide export"
          width={3658}
          height={956}
          className="h-auto w-[1800px] max-w-none min-w-[960px] rounded-lg bg-white"
        />
      </div>
    </div>
  );
}

function ImageAssetGallery({
  onSelectNode,
}: {
  onSelectNode: (id: InspectorNodeId) => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {imageRows.map((row) => (
        <button
          key={row.id}
          type="button"
          data-preview-id={row.id}
          onClick={() => onSelectNode(row.id)}
          className="border-border-subtle bg-surface-card hover:border-primary-30 focus-visible:ring-focus-ring overflow-hidden rounded-lg border text-left transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          <div className="bg-surface-muted flex aspect-[16/10] items-center justify-center p-3">
            <Image
              src={row.source}
              alt={row.name}
              width={420}
              height={260}
              className="h-full w-full object-contain"
            />
          </div>
          <div className="space-y-2 p-4">
            <div className="flex items-start justify-between gap-3">
              <p className="text-text-strong text-sm font-semibold">
                {row.name}
              </p>
              <span className="border-border-subtle text-text-muted shrink-0 rounded-full border px-2 py-0.5 text-[11px] leading-4 font-semibold">
                SVG
              </span>
            </div>
            <p className="text-text-secondary text-xs">{row.role}</p>
            <p className="text-text-muted text-xs leading-5">{row.usage}</p>
          </div>
        </button>
      ))}
    </div>
  );
}

function ImageSourceTable() {
  return (
    <div className="border-border-subtle overflow-hidden rounded-lg border">
      <div className="bg-surface-card border-border-subtle border-b p-4">
        <h3 className="text-text-strong text-lg font-semibold">
          Image export 보관 위치
        </h3>
        <p className="text-text-secondary mt-1 text-sm leading-6">
          원본 보드, 공유용 PDF, 개별 SVG asset을 분리해 기록합니다.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-surface-muted text-text-strong">
            <tr>
              <th className="px-4 py-3 font-semibold">Source</th>
              <th className="px-4 py-3 font-semibold">App path</th>
              <th className="px-4 py-3 font-semibold">Role</th>
              <th className="px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {imageSourceRows.map((row) => (
              <tr key={row.source} className="border-border-subtle border-t">
                <td className="px-4 py-3 font-medium">{row.source}</td>
                <td className="text-text-secondary px-4 py-3">{row.appPath}</td>
                <td className="text-text-secondary px-4 py-3">{row.role}</td>
                <td className="text-text-secondary px-4 py-3">{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function DesignSystemPage() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [primaryCategoryId, setPrimaryCategoryId] = useState('1');
  const [secondaryCategoryIds, setSecondaryCategoryIds] = useState(['all']);
  const [selectedNodeId, setSelectedNodeId] =
    useState<InspectorNodeId>('cover');
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [canvasZoom, setCanvasZoom] = useState(100);
  const [layerSearchQuery, setLayerSearchQuery] = useState('');
  const [shareStatus, setShareStatus] = useState('');
  const [copiedValue, setCopiedValue] = useState('');
  const [activeInspectorTab, setActiveInspectorTab] =
    useState<InspectorTab>('properties');
  const [commentDraft, setCommentDraft] = useState('');
  const [commentsByNode, setCommentsByNode] = useState<
    Partial<Record<InspectorNodeId, string[]>>
  >({});
  const [componentInspection, setComponentInspection] =
    useState<ComponentInspection | null>(null);
  const selectedNode = findInspectorNode(selectedNodeId);
  const selectedNodeComments = commentsByNode[selectedNodeId] ?? [];
  const filteredLayerItems = useMemo(() => {
    const query = layerSearchQuery.trim().toLowerCase();

    if (!query) {
      return sidebarLayerItems;
    }

    return sidebarLayerItems.filter(
      (item) =>
        item.id.toLowerCase().includes(query) ||
        item.label.toLowerCase().includes(query) ||
        item.meta?.toLowerCase().includes(query)
    );
  }, [layerSearchQuery]);
  const gridClassName = isPreviewMode
    ? 'grid min-h-[calc(100vh-36px)] lg:grid-cols-[minmax(0,1fr)]'
    : isSidebarVisible
      ? 'grid min-h-[calc(100vh-36px)] lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)_320px]'
      : 'grid min-h-[calc(100vh-36px)] lg:grid-cols-[minmax(0,1fr)] xl:grid-cols-[minmax(0,1fr)_320px]';

  const copyText = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedValue(value);
      window.setTimeout(() => setCopiedValue(''), 1600);
    } catch {
      setCopiedValue('');
    }
  };

  const shareCurrentSection = async () => {
    const url = `${window.location.origin}${window.location.pathname}${selectedNode.href}`;

    try {
      await navigator.clipboard.writeText(url);
      setShareStatus('복사됨');
      window.setTimeout(() => setShareStatus(''), 1600);
    } catch {
      setShareStatus('복사 실패');
      window.setTimeout(() => setShareStatus(''), 1600);
    }
  };

  const addComment = () => {
    const nextComment = commentDraft.trim();

    if (!nextComment) {
      return;
    }

    setCommentsByNode((current) => ({
      ...current,
      [selectedNodeId]: [...(current[selectedNodeId] ?? []), nextComment],
    }));
    setCommentDraft('');
  };

  const deleteComment = (index: number) => {
    setCommentsByNode((current) => ({
      ...current,
      [selectedNodeId]: (current[selectedNodeId] ?? []).filter(
        (_, commentIndex) => commentIndex !== index
      ),
    }));
  };

  const handleSelectNode = (id: InspectorNodeId) => {
    setSelectedNodeId(id);
    setComponentInspection(null);
  };

  const handleComponentInspect = (event: MouseEvent<HTMLElement>) => {
    const target = event.target;

    if (!(target instanceof HTMLElement)) {
      return;
    }

    const inspectElement = target.closest(
      '[data-inspect-id]'
    ) as HTMLElement | null;

    if (!inspectElement || !event.currentTarget.contains(inspectElement)) {
      return;
    }

    setComponentInspection(measureComponentElement(inspectElement));
    setSelectedNodeId('components');
    setActiveInspectorTab('properties');
    window.history.replaceState(null, '', '#components');
  };

  const getInspectClassName = (id: string, baseClassName = '') => {
    const selectedClassName =
      componentInspection?.id === id
        ? 'ring-2 ring-[#0d99ff] ring-offset-2 ring-offset-white'
        : '';

    return [baseClassName, selectedClassName].filter(Boolean).join(' ');
  };

  useEffect(() => {
    const syncSelectedNodeFromHash = () => {
      const hash = window.location.hash.replace('#', '');
      const hashNode = inspectorNodes.find((node) => node.id === hash);

      if (hashNode) {
        setSelectedNodeId(hashNode.id);
        setComponentInspection(null);
      }
    };

    syncSelectedNodeFromHash();
    window.addEventListener('hashchange', syncSelectedNodeFromHash);

    return () => {
      window.removeEventListener('hashchange', syncSelectedNodeFromHash);
    };
  }, []);

  return (
    <div className="text-text-default min-h-screen bg-[#1f1f1f]">
      <FigmaTopBar
        isPreviewMode={isPreviewMode}
        isSidebarVisible={isSidebarVisible}
        zoom={canvasZoom}
        shareStatus={shareStatus}
        onTogglePreviewMode={() => setIsPreviewMode((current) => !current)}
        onToggleSidebar={() => setIsSidebarVisible((current) => !current)}
        onGoHome={() => {
          setSelectedNodeId('cover');
          setComponentInspection(null);
          window.location.hash = 'cover';
        }}
        onZoomIn={() => setCanvasZoom((current) => Math.min(150, current + 10))}
        onZoomOut={() => setCanvasZoom((current) => Math.max(70, current - 10))}
        onResetZoom={() => setCanvasZoom(100)}
        onShareCurrentSection={shareCurrentSection}
      />
      <div className={gridClassName}>
        {!isPreviewMode && isSidebarVisible ? (
          <DesignSystemSidebar
            selectedNodeId={selectedNodeId}
            layerSearchQuery={layerSearchQuery}
            filteredLayerItems={filteredLayerItems}
            onSelectNode={handleSelectNode}
            onLayerSearchChange={setLayerSearchQuery}
          />
        ) : null}

        <main className="min-w-0 bg-[#1f1f1f] px-4 py-10 md:px-8 lg:px-12">
          <div
            className="mx-auto flex w-full max-w-[1320px] flex-col gap-14 transition-transform duration-150"
            style={{
              transform: `scale(${canvasZoom / 100})`,
              transformOrigin: 'top center',
            }}
          >
            <header id="cover" className="scroll-mt-16">
              <p className="text-neutral-60 mb-2 px-1 text-xs font-semibold">
                cover
              </p>
              <div className="border-border-subtle grid gap-8 rounded-sm border bg-white px-5 py-7 shadow-[0_18px_40px_rgb(0_0_0_/_18%)] md:px-8 md:py-9 lg:grid-cols-[1fr_360px] lg:items-end lg:px-10">
                <div className="space-y-5">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="primary">Code source of truth</Badge>
                    <Badge variant="outline">Storybook synced</Badge>
                    <Badge variant="default">Figma archived</Badge>
                  </div>
                  <div className="space-y-4">
                    <p className="font-emphasis text-action-tertiary-fg text-xl font-bold">
                      ModusPlant Design System
                    </p>
                    <h1 className="text-text-strong max-w-4xl text-3xl leading-tight font-bold md:text-5xl">
                      모두의식물 UI를 코드와 Storybook 기준으로 운영합니다.
                    </h1>
                    <p className="text-text-secondary max-w-3xl text-base leading-7">
                      이 페이지는 Figma 스타일가이드처럼 보는 내부 운영
                      화면입니다. 실제 컴포넌트를 렌더링하고, 토큰과 Storybook
                      문서를 함께 연결해 AI 수정의 기준점을 코드 안에 둡니다.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href="#components"
                      className="bg-action-primary-bg text-action-primary-fg hover:bg-action-primary-hover focus-visible:ring-focus-ring inline-flex items-center justify-center rounded-full px-4 py-2 text-base transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                    >
                      컴포넌트 보기
                    </Link>
                    <Link
                      href={figmaUrl}
                      target="_blank"
                      className="border-action-tertiary-border text-action-tertiary-fg hover:bg-action-tertiary-hover focus-visible:ring-focus-ring inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2 text-base transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                    >
                      Figma 원본
                      <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                </div>

                <div className="border-border-subtle bg-surface-muted rounded-lg border p-5">
                  <p className="text-text-strong mb-4 text-sm font-semibold">
                    운영 파이프라인
                  </p>
                  <ol className="space-y-3 text-sm">
                    {[
                      'Figma는 보관/참조용으로 유지',
                      '토큰은 app/globals.css에서 관리',
                      '컴포넌트는 components/_common 기준',
                      '상태/변형은 Storybook에서 검증',
                      'AI 수정은 docs/design-system 규칙을 따른다',
                    ].map((item) => (
                      <li key={item} className="flex gap-3">
                        <span className="bg-action-primary-bg mt-1 h-2 w-2 shrink-0 rounded-full" />
                        <span className="text-text-secondary">{item}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </header>

            <Section
              id="logo"
              eyebrow="Brand"
              title="Logo"
              description="현재 서비스에 포함된 실제 SVG 자산을 기준으로 로고와 심볼 사용처를 확인합니다."
            >
              <div className="space-y-8">
                <LogoSystemPreview />

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {logoAssets.map((asset) => (
                    <LogoCard key={asset.path} asset={asset} />
                  ))}
                </div>
                <div className="border-border-subtle bg-surface-muted rounded-lg border p-4 text-sm leading-6">
                  <p className="text-text-strong font-semibold">운영 기준</p>
                  <p className="text-text-secondary mt-1">
                    코드 검색 기준 현재 화면에서 쓰이는 로고는 v2 계열입니다. v1
                    자산은 실제 사용처가 확인되지 않아 운영 로고에서는 빼고,
                    보관/삭제 후보로 따로 관리합니다.
                  </p>
                </div>

                <div className="border-border-subtle overflow-hidden rounded-lg border">
                  <div className="bg-surface-card border-border-subtle flex flex-col gap-3 border-b p-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="text-text-strong text-lg font-semibold">
                        로고 소스 정리
                      </h3>
                      <p className="text-text-secondary mt-1 text-sm leading-6">
                        원본 보관 경로는{' '}
                        <code className="bg-surface-muted rounded px-1.5 py-0.5">
                          C:\modusplant\modusplant_frontend-develop\figma_export\00.logo
                        </code>
                        입니다. 큰 프레임 이미지는 보관용으로 두고, 운영
                        화면에는 사용처와 자산 관계만 시스템으로 정리합니다.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[
                        ['SVG ZIP', figmaLogoAsset.svgZip],
                        ['PDF ZIP', figmaLogoAsset.pdfZip],
                      ].map(([label, href]) => (
                        <Link
                          key={label}
                          href={href}
                          target="_blank"
                          className="border-action-tertiary-border text-action-tertiary-fg hover:bg-action-tertiary-hover focus-visible:ring-focus-ring inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-none"
                        >
                          {label}
                          <ExternalLink
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                          />
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[940px] text-left text-sm">
                      <thead className="bg-surface-muted text-text-strong">
                        <tr>
                          <th className="px-4 py-3 font-semibold">
                            Source file
                          </th>
                          <th className="px-4 py-3 font-semibold">App path</th>
                          <th className="px-4 py-3 font-semibold">Role</th>
                          <th className="px-4 py-3 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {logoSourceRows.map((row) => (
                          <tr
                            key={row.source}
                            className="border-border-subtle border-t align-top"
                          >
                            <td className="px-4 py-3 font-medium">
                              {row.source}
                            </td>
                            <td className="text-text-secondary px-4 py-3">
                              {row.appPath}
                            </td>
                            <td className="text-text-secondary px-4 py-3">
                              {row.role}
                            </td>
                            <td className="text-text-secondary px-4 py-3">
                              {row.status}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="border-border-subtle min-w-0 overflow-hidden rounded-lg border">
                    <div className="bg-surface-card border-border-subtle border-b p-4">
                      <h3 className="text-text-strong text-lg font-semibold">
                        실제 사용처
                      </h3>
                      <p className="text-text-secondary mt-1 text-sm leading-6">
                        코드 검색으로 확인한 현재 서비스의 로고 연결 지점입니다.
                      </p>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[720px] text-left text-sm">
                        <thead className="bg-surface-muted text-text-strong">
                          <tr>
                            <th className="px-4 py-3 font-semibold">Surface</th>
                            <th className="px-4 py-3 font-semibold">
                              Code path
                            </th>
                            <th className="px-4 py-3 font-semibold">Asset</th>
                            <th className="px-4 py-3 font-semibold">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {logoUsageRows.map((row) => (
                            <tr
                              key={row.surface}
                              className="border-border-subtle border-t align-top"
                            >
                              <td className="px-4 py-3 font-medium">
                                {row.surface}
                              </td>
                              <td className="text-text-secondary px-4 py-3">
                                {row.codePath}
                              </td>
                              <td className="text-text-secondary px-4 py-3">
                                {row.asset}
                              </td>
                              <td className="text-text-secondary px-4 py-3">
                                {row.status}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="border-border-subtle min-w-0 overflow-hidden rounded-lg border">
                    <div className="bg-surface-card border-border-subtle border-b p-4">
                      <h3 className="text-text-strong text-lg font-semibold">
                        미사용/보관 자산
                      </h3>
                      <p className="text-text-secondary mt-1 text-sm leading-6">
                        현재 코드에서 화면 사용처가 확인되지 않은 legacy
                        자산입니다.
                      </p>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[640px] text-left text-sm">
                        <thead className="bg-surface-muted text-text-strong">
                          <tr>
                            <th className="px-4 py-3 font-semibold">Asset</th>
                            <th className="px-4 py-3 font-semibold">Role</th>
                            <th className="px-4 py-3 font-semibold">Usage</th>
                          </tr>
                        </thead>
                        <tbody>
                          {legacyLogoRows.map((row) => (
                            <tr
                              key={row.asset}
                              className="border-border-subtle border-t align-top"
                            >
                              <td className="px-4 py-3 font-medium">
                                {row.asset}
                              </td>
                              <td className="text-text-secondary px-4 py-3">
                                {row.role}
                              </td>
                              <td className="text-text-secondary px-4 py-3">
                                {row.usage}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="border-border-subtle overflow-hidden rounded-lg border">
                  <div className="bg-surface-card border-border-subtle border-b p-4">
                    <h3 className="text-text-strong text-lg font-semibold">
                      Figma 이름과 코드 자산 매핑
                    </h3>
                    <p className="text-text-secondary mt-1 text-sm leading-6">
                      Figma 프레임명과 실제 서비스 파일명이 다를 수 있어, 로고는
                      파일명보다 역할과 사용 여부를 기준으로 표시합니다.
                    </p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[980px] text-left text-sm">
                      <thead className="bg-surface-muted text-text-strong">
                        <tr>
                          <th className="px-4 py-3 font-semibold">
                            Figma name
                          </th>
                          <th className="px-4 py-3 font-semibold">
                            Code asset
                          </th>
                          <th className="px-4 py-3 font-semibold">Value</th>
                          <th className="px-4 py-3 font-semibold">Status</th>
                          <th className="px-4 py-3 font-semibold">근거</th>
                          <th className="px-4 py-3 font-semibold">다음 처리</th>
                        </tr>
                      </thead>
                      <tbody>
                        {logoNameMappingRows.map((row) => (
                          <tr
                            key={`${row.figmaName}-${row.codeName}`}
                            className="border-border-subtle border-t align-top"
                          >
                            <td className="px-4 py-3 font-medium">
                              {row.figmaName}
                            </td>
                            <td className="text-text-secondary px-4 py-3">
                              {row.codeName}
                            </td>
                            <td className="text-text-secondary px-4 py-3">
                              {row.value}
                            </td>
                            <td className="px-4 py-3">
                              <NameMappingStatus status={row.status} />
                            </td>
                            <td className="text-text-secondary px-4 py-3 leading-6">
                              {row.reason}
                            </td>
                            <td className="text-text-secondary px-4 py-3 leading-6">
                              {row.action}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </Section>

            <Section
              id="color"
              eyebrow="Foundations"
              title="01.Color"
              description="Figma 01.Color 원본과 현재 코드 토큰을 한 화면에서 비교합니다. 실제 운영 기준은 app/globals.css의 CSS variable입니다."
            >
              <div className="space-y-8">
                <div className="border-border-subtle overflow-hidden rounded-lg border">
                  <div className="bg-surface-card flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-text-strong text-lg font-semibold">
                        Figma 01.Color 원본
                      </h3>
                      <p className="text-text-secondary mt-1 text-sm">
                        사용자가 제공한 SVG/PDF/JPG를 public asset으로 보관해
                        좌측 메뉴에서 바로 확인할 수 있게 했습니다.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[
                        ['SVG', figmaColorAsset.svg],
                        ['PDF', figmaColorAsset.pdf],
                        ['JPG', figmaColorAsset.jpg],
                      ].map(([label, href]) => (
                        <Link
                          key={label}
                          href={href}
                          target="_blank"
                          className="border-action-tertiary-border text-action-tertiary-fg hover:bg-action-tertiary-hover focus-visible:ring-focus-ring inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-none"
                        >
                          {label}
                          <ExternalLink
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                          />
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className="border-border-subtle bg-surface-muted max-h-[720px] overflow-auto border-t p-4">
                    <Image
                      src={figmaColorAsset.svg}
                      alt="Figma 01.Color guide export"
                      width={1342}
                      height={1855}
                      className="mx-auto h-auto max-w-full min-w-[760px] rounded-lg bg-white"
                      priority
                    />
                  </div>
                </div>

                <ColorGroup
                  title="Primary"
                  description="브랜드 정체성과 CTA, hover, active 상태에 사용하는 초록 계열입니다."
                  colors={primaryColors}
                />

                <div className="border-border-subtle overflow-hidden rounded-lg border">
                  <div className="bg-surface-card border-border-subtle border-b p-4">
                    <h3 className="text-text-strong text-lg font-semibold">
                      Figma 이름과 코드 이름 매핑
                    </h3>
                    <p className="text-text-secondary mt-1 text-sm leading-6">
                      이미지 기반으로 코드가 수정된 부분은 이름이 달라도 값과
                      역할이 맞으면 유지하고, 이름/값이 충돌하는 항목은 결정
                      필요로 표시합니다.
                    </p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[920px] text-left text-sm">
                      <thead className="bg-surface-muted text-text-strong">
                        <tr>
                          <th className="px-4 py-3 font-semibold">
                            Figma name
                          </th>
                          <th className="px-4 py-3 font-semibold">
                            Code token
                          </th>
                          <th className="px-4 py-3 font-semibold">Value</th>
                          <th className="px-4 py-3 font-semibold">Status</th>
                          <th className="px-4 py-3 font-semibold">근거</th>
                          <th className="px-4 py-3 font-semibold">다음 처리</th>
                        </tr>
                      </thead>
                      <tbody>
                        {colorNameMappingRows.map((row) => (
                          <tr
                            key={`${row.figmaName}-${row.codeName}`}
                            className="border-border-subtle border-t align-top"
                          >
                            <td className="px-4 py-3 font-medium">
                              {row.figmaName}
                            </td>
                            <td className="text-text-secondary px-4 py-3">
                              {row.codeName}
                            </td>
                            <td className="text-text-secondary px-4 py-3">
                              {row.value}
                            </td>
                            <td className="px-4 py-3">
                              <NameMappingStatus status={row.status} />
                            </td>
                            <td className="text-text-secondary px-4 py-3 leading-6">
                              {row.reason}
                            </td>
                            <td className="text-text-secondary px-4 py-3 leading-6">
                              {row.action}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <ColorGroup
                  title="Neutral"
                  description="배경, 선, 그림자, 텍스트 계층을 구성하는 회색 계열입니다."
                  colors={neutralColors}
                />

                <ColorGroup
                  title="Surface"
                  description="페이지, 패널, divider, form border 등 화면 표면에 사용하는 색입니다."
                  colors={surfaceColors}
                />

                <ColorGroup
                  title="System"
                  description="오류, 경고, 안내, 성공 같은 상태 표현에 사용하는 색입니다."
                  colors={systemColors}
                />

                <div>
                  <div className="mb-4 space-y-1">
                    <h3 className="text-text-strong text-lg font-semibold">
                      Shadow
                    </h3>
                    <p className="text-text-secondary text-sm leading-6">
                      01.Color에는 pop-up shadow가 포함되어 있어 코드 토큰으로
                      같이 관리합니다.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {shadowTokens.map((shadow) => (
                      <div
                        key={shadow.token}
                        className="border-border-subtle bg-surface-card rounded-lg border p-4"
                      >
                        <div
                          className="mx-auto mb-4 h-16 w-16 rounded-lg bg-white"
                          style={{ boxShadow: shadow.value }}
                        />
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-text-strong text-sm font-semibold">
                              {shadow.figmaName}
                            </p>
                            <p className="text-text-muted mt-1 text-xs">
                              {shadow.token}
                            </p>
                            <p className="text-text-secondary mt-1 text-xs">
                              {shadow.value}
                            </p>
                            <p className="text-text-muted mt-1 text-xs">
                              {shadow.role}
                            </p>
                          </div>
                          <StatusPill status={shadow.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-border-subtle overflow-hidden rounded-lg border">
                  <table className="w-full min-w-[640px] text-left text-sm">
                    <thead className="bg-surface-muted text-text-strong">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Semantic</th>
                        <th className="px-4 py-3 font-semibold">
                          CSS variable
                        </th>
                        <th className="px-4 py-3 font-semibold">Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {semanticTokens.map(([semantic, variable, role]) => (
                        <tr
                          key={semantic}
                          className="border-border-subtle border-t"
                        >
                          <td className="px-4 py-3 font-medium">{semantic}</td>
                          <td className="text-text-secondary px-4 py-3">
                            {variable}
                          </td>
                          <td className="text-text-secondary px-4 py-3">
                            {role}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="border-border-subtle bg-surface-muted rounded-lg border p-5">
                  <h3 className="text-text-strong text-lg font-semibold">
                    컬러에서 더 필요한 것
                  </h3>
                  <ul className="mt-4 grid gap-3 md:grid-cols-2">
                    {colorAuditItems.map((item) => (
                      <li key={item} className="flex gap-3 text-sm leading-6">
                        <span className="bg-action-primary-bg mt-2 h-2 w-2 shrink-0 rounded-full" />
                        <span className="text-text-secondary">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Section>

            <Section
              id="typography"
              eyebrow="Foundations"
              title="02.Typography"
              description="Figma 02.Typography 원본을 보관하면서, 실제 운영은 코드 utility와 Storybook 기준으로 맞춥니다."
            >
              <div className="space-y-8">
                <TypographySourcePreview />

                <TypographySystemGuide />

                <TypographySpecTable />

                <div className="border-border-subtle overflow-hidden rounded-lg border">
                  <div className="bg-surface-card border-border-subtle border-b p-4">
                    <h3 className="text-text-strong text-lg font-semibold">
                      Figma export 보관 위치
                    </h3>
                    <p className="text-text-secondary mt-1 text-sm leading-6">
                      원본 이미지는 비교/감사용으로 남기고, 서비스 화면은 위의
                      토큰 표를 기준으로 수정합니다.
                    </p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] text-left text-sm">
                      <thead className="bg-surface-muted text-text-strong">
                        <tr>
                          <th className="px-4 py-3 font-semibold">Source</th>
                          <th className="px-4 py-3 font-semibold">App path</th>
                          <th className="px-4 py-3 font-semibold">Role</th>
                          <th className="px-4 py-3 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {typographySourceRows.map((row) => (
                          <tr
                            key={row.source}
                            className="border-border-subtle border-t"
                          >
                            <td className="px-4 py-3 font-medium">
                              {row.source}
                            </td>
                            <td className="text-text-secondary px-4 py-3">
                              {row.appPath}
                            </td>
                            <td className="text-text-secondary px-4 py-3">
                              {row.role}
                            </td>
                            <td className="text-text-secondary px-4 py-3">
                              {row.status}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="border-border-subtle bg-surface-muted rounded-lg border p-5">
                  <h3 className="text-text-strong text-lg font-semibold">
                    타이포에서 더 필요한 것
                  </h3>
                  <ul className="mt-4 grid gap-3 md:grid-cols-2">
                    {typographyAuditItems.map((item) => (
                      <li key={item} className="flex gap-3 text-sm leading-6">
                        <span className="bg-action-primary-bg mt-2 h-2 w-2 shrink-0 rounded-full" />
                        <span className="text-text-secondary">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Section>

            <Section
              id="layout"
              eyebrow="Foundations"
              title="03.Layout"
              description="PC, Tablet, Mobile 기준의 content area, columns, gutter, margin을 Figma export와 코드 운영 기준으로 함께 정리합니다."
            >
              <div className="space-y-8">
                <LayoutSourcePreview />

                <div>
                  <div className="mb-4 space-y-1">
                    <h3 className="text-text-strong text-lg font-semibold">
                      Breakpoint grid
                    </h3>
                    <p className="text-text-secondary text-sm leading-6">
                      각 카드의 값은 우측 속성 패널과 연결되는 운영 후보
                      수치입니다.
                    </p>
                  </div>
                  <LayoutSpecCards onSelectNode={setSelectedNodeId} />
                </div>

                <LayoutSourceTable />
              </div>
            </Section>

            <Section
              id="image"
              eyebrow="Foundations"
              title="04.Image"
              description="Figma의 기본 이미지 보드를 보관하고, 실제 서비스에서 사용할 수 있는 개별 이미지 후보를 asset 단위로 분리합니다."
            >
              <div className="space-y-8">
                <ImageSourcePreview />

                <div>
                  <div className="mb-4 space-y-1">
                    <h3 className="text-text-strong text-lg font-semibold">
                      Image assets
                    </h3>
                    <p className="text-text-secondary text-sm leading-6">
                      이미지 후보를 개별 asset으로 보며 사용처와 운영 여부를
                      따로 결정합니다.
                    </p>
                  </div>
                  <ImageAssetGallery onSelectNode={setSelectedNodeId} />
                </div>

                <ImageSourceTable />
              </div>
            </Section>

            <Section
              id="components"
              eyebrow="Components"
              title="Live Samples"
              description="이미 서비스에서 사용하는 공통 컴포넌트를 직접 렌더링합니다."
            >
              <div
                className="space-y-8"
                onClickCapture={handleComponentInspect}
              >
                <div
                  data-inspect-id="component.button-group"
                  data-inspect-label="Button group"
                  data-inspect-kind="Component group"
                  data-inspect-description="Button 컴포넌트 묶음의 flex gap과 card padding을 실측합니다."
                  data-code-path="components/_common/button.tsx"
                  data-storybook-path="stories/components/common/Button.stories.tsx"
                  className={getInspectClassName(
                    'component.button-group',
                    'border-border-subtle cursor-crosshair rounded-lg border p-5 transition-shadow'
                  )}
                >
                  <h3 className="text-text-strong mb-4 text-lg font-semibold">
                    Button
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant="primary"
                      data-inspect-id="button.primary"
                      data-inspect-label="Button / Primary"
                      data-inspect-kind="Button"
                      data-inspect-description="주요 CTA 버튼의 실제 padding, radius, typography를 실측합니다."
                      data-code-path="components/_common/button.tsx"
                      data-storybook-path="stories/components/common/Button.stories.tsx"
                      className={getInspectClassName('button.primary')}
                    >
                      등록하기
                    </Button>
                    <Button
                      variant="secondary"
                      data-inspect-id="button.secondary"
                      data-inspect-label="Button / Secondary"
                      data-inspect-kind="Button"
                      data-code-path="components/_common/button.tsx"
                      data-storybook-path="stories/components/common/Button.stories.tsx"
                      className={getInspectClassName('button.secondary')}
                    >
                      보조 버튼
                    </Button>
                    <Button
                      variant="tertiary"
                      data-inspect-id="button.tertiary"
                      data-inspect-label="Button / Tertiary"
                      data-inspect-kind="Button"
                      data-code-path="components/_common/button.tsx"
                      data-storybook-path="stories/components/common/Button.stories.tsx"
                      className={getInspectClassName('button.tertiary')}
                    >
                      수정하기
                    </Button>
                    <Button
                      variant="ghost"
                      data-inspect-id="button.ghost"
                      data-inspect-label="Button / Ghost"
                      data-inspect-kind="Button"
                      data-code-path="components/_common/button.tsx"
                      data-storybook-path="stories/components/common/Button.stories.tsx"
                      className={getInspectClassName('button.ghost')}
                    >
                      건너뛰기
                    </Button>
                    <Button
                      variant="danger"
                      data-inspect-id="button.danger"
                      data-inspect-label="Button / Danger"
                      data-inspect-kind="Button"
                      data-code-path="components/_common/button.tsx"
                      data-storybook-path="stories/components/common/Button.stories.tsx"
                      className={getInspectClassName('button.danger')}
                    >
                      삭제하기
                    </Button>
                    <span
                      data-inspect-id="button.loading"
                      data-inspect-label="Button / Loading"
                      data-inspect-kind="Button state"
                      data-code-path="components/_common/button.tsx"
                      data-storybook-path="stories/components/common/Button.stories.tsx"
                      className={getInspectClassName(
                        'button.loading',
                        'inline-flex cursor-crosshair rounded-full'
                      )}
                    >
                      <Button
                        variant="primary"
                        loading
                        className="pointer-events-none"
                      >
                        저장 중
                      </Button>
                    </span>
                  </div>
                </div>

                <div className="grid gap-5 lg:grid-cols-2">
                  <div
                    data-inspect-id="component.form-controls"
                    data-inspect-label="Form controls group"
                    data-inspect-kind="Component group"
                    data-inspect-description="Input, Textarea, Checkbox 묶음의 vertical spacing을 실측합니다."
                    data-code-path="components/_common/input.tsx"
                    data-storybook-path="stories/components/common/Input.stories.tsx"
                    className={getInspectClassName(
                      'component.form-controls',
                      'border-border-subtle cursor-crosshair rounded-lg border p-5 transition-shadow'
                    )}
                  >
                    <h3 className="text-text-strong mb-4 text-lg font-semibold">
                      Form Controls
                    </h3>
                    <div className="space-y-4">
                      <div
                        data-inspect-id="input.nickname-field"
                        data-inspect-label="Input field / Helper"
                        data-inspect-kind="Field wrapper"
                        data-code-path="components/_common/input.tsx"
                        data-storybook-path="stories/components/common/Input.stories.tsx"
                        className={getInspectClassName(
                          'input.nickname-field',
                          'rounded-lg'
                        )}
                      >
                        <Input
                          placeholder="닉네임을 입력해 주세요"
                          helperText="2자 이상 12자 이하로 입력합니다."
                          data-inspect-id="input.nickname"
                          data-inspect-label="Input / Default"
                          data-inspect-kind="Input"
                          data-code-path="components/_common/input.tsx"
                          data-storybook-path="stories/components/common/Input.stories.tsx"
                          className={getInspectClassName('input.nickname')}
                        />
                      </div>
                      <div
                        data-inspect-id="input.error-field"
                        data-inspect-label="Input field / Error"
                        data-inspect-kind="Field wrapper"
                        data-code-path="components/_common/input.tsx"
                        data-storybook-path="stories/components/common/Input.stories.tsx"
                        className={getInspectClassName(
                          'input.error-field',
                          'rounded-lg'
                        )}
                      >
                        <Input
                          placeholder="오류 상태"
                          error="사용할 수 없는 값입니다."
                          defaultValue="wrong-value"
                          data-inspect-id="input.error"
                          data-inspect-label="Input / Error"
                          data-inspect-kind="Input"
                          data-code-path="components/_common/input.tsx"
                          data-storybook-path="stories/components/common/Input.stories.tsx"
                          className={getInspectClassName('input.error')}
                        />
                      </div>
                      <div
                        data-inspect-id="textarea.counter-field"
                        data-inspect-label="Textarea field / Counter"
                        data-inspect-kind="Field wrapper"
                        data-code-path="components/_common/textarea.tsx"
                        data-storybook-path="stories/components/common/Textarea.stories.tsx"
                        className={getInspectClassName(
                          'textarea.counter-field',
                          'rounded-lg'
                        )}
                      >
                        <Textarea
                          placeholder="식물 이야기를 적어주세요"
                          showCount
                          maxLength={120}
                          data-inspect-id="textarea.counter"
                          data-inspect-label="Textarea / Counter"
                          data-inspect-kind="Textarea"
                          data-code-path="components/_common/textarea.tsx"
                          data-storybook-path="stories/components/common/Textarea.stories.tsx"
                          className={getInspectClassName('textarea.counter')}
                        />
                      </div>
                      <div
                        data-inspect-id="checkbox.confirm"
                        data-inspect-label="Checkbox / Checked"
                        data-inspect-kind="Checkbox"
                        data-code-path="components/_common/checkbox.tsx"
                        data-storybook-path="pending"
                        className={getInspectClassName(
                          'checkbox.confirm',
                          'rounded-md'
                        )}
                      >
                        <Checkbox
                          id="design-system-checkbox"
                          label="운영 규칙을 확인했습니다"
                          defaultChecked
                        />
                      </div>
                    </div>
                  </div>

                  <div
                    data-inspect-id="component.navigation-inputs"
                    data-inspect-label="Navigation inputs group"
                    data-inspect-kind="Component group"
                    data-inspect-description="SearchBar, category filter, Dropdown 묶음의 spacing을 실측합니다."
                    data-code-path="components/search/searchbar.tsx"
                    data-storybook-path="stories/components/search/SearchBar.stories.tsx"
                    className={getInspectClassName(
                      'component.navigation-inputs',
                      'border-border-subtle cursor-crosshair rounded-lg border p-5 transition-shadow'
                    )}
                  >
                    <h3 className="text-text-strong mb-4 text-lg font-semibold">
                      Navigation Inputs
                    </h3>
                    <div className="space-y-4">
                      <div
                        data-inspect-id="searchbar.default"
                        data-inspect-label="SearchBar / Default"
                        data-inspect-kind="SearchBar"
                        data-code-path="components/search/searchbar.tsx"
                        data-storybook-path="stories/components/search/SearchBar.stories.tsx"
                        className={getInspectClassName(
                          'searchbar.default',
                          'rounded-full'
                        )}
                      >
                        <SearchBar placeholder="식물 이름, 게시글 검색" />
                      </div>
                      <div
                        data-inspect-id="category-filter.group"
                        data-inspect-label="Category filters group"
                        data-inspect-kind="Filter group"
                        data-code-path="components/_common/primaryCategoryFilter.tsx"
                        data-storybook-path="stories/components/common/CategoryFilter.stories.tsx"
                        className={getInspectClassName(
                          'category-filter.group',
                          'flex flex-col gap-3 rounded-lg md:flex-row'
                        )}
                      >
                        <PrimaryCategoryFilter
                          selectedCategoryId={primaryCategoryId}
                          onCategoryChange={(categoryId) => {
                            setPrimaryCategoryId(categoryId);
                            setSecondaryCategoryIds(['all']);
                          }}
                        />
                        <SecondaryCategoryFilter
                          primaryCategoryId={primaryCategoryId}
                          selectedCategoryIds={secondaryCategoryIds}
                          onCategoriesChange={setSecondaryCategoryIds}
                        />
                      </div>
                      <div
                        data-inspect-id="dropdown.menu"
                        data-inspect-label="Dropdown / Menu"
                        data-inspect-kind="Dropdown"
                        data-code-path="components/_common/dropdown.tsx"
                        data-storybook-path="stories/components/common/Dropdown.stories.tsx"
                        className={getInspectClassName(
                          'dropdown.menu',
                          'inline-block rounded-full'
                        )}
                      >
                        <Dropdown
                          isOpen={dropdownOpen}
                          onOpen={() => setDropdownOpen(true)}
                          onClose={() => setDropdownOpen(false)}
                          width="w-40"
                          contentAriaLabel="디자인시스템 메뉴"
                          trigger={
                            <Button
                              type="button"
                              variant="secondary"
                              onClick={() =>
                                setDropdownOpen((current) => !current)
                              }
                              className="gap-2"
                            >
                              메뉴 열기
                              <ChevronDown
                                className="h-4 w-4"
                                aria-hidden="true"
                              />
                            </Button>
                          }
                          items={[
                            {
                              label: '토큰',
                              onClick: () => undefined,
                              textAlign: 'left',
                            },
                            {
                              label: '컴포넌트',
                              onClick: () => undefined,
                              textAlign: 'left',
                            },
                            {
                              label: '위험 액션',
                              onClick: () => undefined,
                              textAlign: 'left',
                              variant: 'danger',
                            },
                          ]}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  data-inspect-id="emptystate.default"
                  data-inspect-label="EmptyState / Default"
                  data-inspect-kind="EmptyState"
                  data-code-path="components/_common/emptyState.tsx"
                  data-storybook-path="stories/components/common/EmptyState.stories.tsx"
                  className={getInspectClassName(
                    'emptystate.default',
                    'border-border-subtle cursor-crosshair rounded-lg border p-5 transition-shadow'
                  )}
                >
                  <h3 className="text-text-strong mb-4 text-lg font-semibold">
                    Empty State
                  </h3>
                  <EmptyState
                    title="아직 등록된 가이드가 없어요"
                    description="Storybook에 먼저 정리한 뒤 이 페이지에 연결합니다."
                    buttonText="홈으로 이동"
                    buttonHref="/"
                  />
                </div>
              </div>
            </Section>

            <Section
              id="map"
              eyebrow="Governance"
              title="Component Map"
              description="Figma 이름, 코드 위치, Storybook 경로를 한 줄로 이어 AI가 재사용할 수 있게 합니다."
            >
              <div className="border-border-subtle overflow-hidden rounded-lg border">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="bg-surface-muted text-text-strong">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Component</th>
                      <th className="px-4 py-3 font-semibold">Code path</th>
                      <th className="px-4 py-3 font-semibold">
                        Storybook path
                      </th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {componentRows.map(
                      ([name, codePath, storyPath, status]) => (
                        <tr
                          key={name}
                          className="border-border-subtle border-t"
                        >
                          <td className="px-4 py-3 font-medium">{name}</td>
                          <td className="text-text-secondary px-4 py-3">
                            {codePath}
                          </td>
                          <td className="text-text-secondary px-4 py-3">
                            {storyPath}
                          </td>
                          <td className="px-4 py-3">
                            <Badge
                              variant={
                                status === 'matched' ? 'primary' : 'outline'
                              }
                            >
                              {status}
                            </Badge>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </Section>
          </div>
        </main>

        {!isPreviewMode ? (
          <InspectorPanel
            node={selectedNode}
            componentInspection={componentInspection}
            zoom={canvasZoom}
            activeTab={activeInspectorTab}
            comments={selectedNodeComments}
            commentDraft={commentDraft}
            copiedValue={copiedValue}
            onActiveTabChange={setActiveInspectorTab}
            onCommentDraftChange={setCommentDraft}
            onAddComment={addComment}
            onDeleteComment={deleteComment}
            onCopy={copyText}
          />
        ) : null}
      </div>
    </div>
  );
}
