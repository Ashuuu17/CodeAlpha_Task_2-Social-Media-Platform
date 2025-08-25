export const isNonEmpty = (s) => typeof s === 'string' && s.trim().length > 0;
export const sanitize = (s) => s.replace(/</g, '&lt;').replace(/>/g, '&gt;');
