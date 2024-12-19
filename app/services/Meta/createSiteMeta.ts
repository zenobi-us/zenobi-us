export function createSiteMeta({ description }: { description?: string }) {
  return [
    { title: 'Zenobius' },
    { name: 'description', content: description || '' },
  ];
}
