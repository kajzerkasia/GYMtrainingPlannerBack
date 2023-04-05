
export const slugify = (str: string, existingSlugs: string[] = []): string => {
    // remove polish letters
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

    // check if slug already exists
    let num = 2;
    let baseSlug = slug;

    while (existingSlugs.includes(slug)) {
        slug = `${baseSlug}-${num}`;
        num++;
    }

    return slug;
};