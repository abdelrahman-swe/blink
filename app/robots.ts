import { MetadataRoute } from 'next';
import { PUBLIC_API_BASE } from '@/lib/config';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
        },
        sitemap: `${PUBLIC_API_BASE}/sitemap.xml`,
    };
}
