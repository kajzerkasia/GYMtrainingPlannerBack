export const slugify = (str: string, existingSlugs: string[] = []): string => {
    // Usuń polskie znaki
    str = str.replace(/[ąĄ]/g, 'a')
        .replace(/[ćĆ]/g, 'c')
        .replace(/[ęĘ]/g, 'e')
        .replace(/[łŁ]/g, 'l')
        .replace(/[ńŃ]/g, 'n')
        .replace(/[óÓ]/g, 'o')
        .replace(/[śŚ]/g, 's')
        .replace(/[żŻźŹ]/g, 'z');

    let slug = str
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    // Sprawdź, czy slug już istnieje wśród istniejących slugów
    if (!existingSlugs.includes(slug)) {
        return slug;
    }

    // Jeśli slug już istnieje, dodaj liczbę, aby uniknąć duplikatów
    let num = 2;
    let baseSlug = slug;
    while (existingSlugs.includes(slug)) {
        slug = `${baseSlug}-${num}`;
        num++;
    }

    return slug;
};