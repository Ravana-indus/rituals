import React, { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../components/Header';

type Category = 'hair' | 'skin' | 'fragrance';

type Product = {
  id: string; name: string; tagline: string; description: string;
  curatorPrice: number; marketPrice: number; badge: string | null; badgeType: string | null;
  stockPercent: number; stockLeft: number | null; expiry: string; whyDiscounted: string;
  image: string; thumb: string;
};

const PRODUCTS_HAIR: Product[] = [
  {
    id: 'h0', name: 'Neem Infused Scalp Elixir', tagline: '100ml / Ritual Foundation',
    description: 'Sesame & Gotu Kola infusion for scalp revitalization.',
    curatorPrice: 4200, marketPrice: 6800, badge: 'Heritage Find', badgeType: 'tertiary' as const,
    stockPercent: 30, stockLeft: 6 as number | null, expiry: 'Dec 2026', whyDiscounted: 'Heritage batch',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7os9A8-iepf_8gSU8WlQLLNEuG-Ga8MCLVqbWjrQbDk6DRvx6SJ-mWXjc-ZBVy377A5gzCOZhTiIqxzaQz3TOZJxKUuS3gxCjFK6HT7Qq3ZqtoNaRZSK1PF9qCse-MvSk2_dvK41wGa1rL7P6HCnks0sctq2iQzW0shJKdlPONBvQLVG4ryD8TZXWFvPYP5LHrnZD1HaM5-dVpGB-3CIT5wCmxNY8El4l5zOoIC1tAc_sCTkmkvLm-qoCuPytm3iZ2GCedpfx_a07',
    thumb: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJzZMaUqwGljt0KrPoG4t5vuSvV88AswSGGwDw4ZMQ_c4N3Exoy_-rSaa1F6GsyEJWgYJ0qEiuNViObd-IVIIVvN8l8OPMBDvDb7zwaEQpMLBA_u25OxekZGw8liJbhm-JtI4hSN0QMK4qtXkBFlrUuOSM95SuOUnVZ0XUIRvjEClorIgtTceBugj4z4E4f5EogTQIW_0vbJ_Ow6XpbZjNpvGaFM4eHkgQ7rNtHwj06lgwvMcVv1t-IEr_z0HeDHb6Q6MTMdrX8cHP',
  },
  {
    id: 'h1', name: 'Hibiscus Revival Mask', tagline: '250ml / Gentle Purification',
    description: 'Deep conditioning with crushed hibiscus petals and organic coconut milk.',
    curatorPrice: 3500, marketPrice: 5500, badge: 'Thrifty Luxury', badgeType: 'secondary' as const,
    stockPercent: 55, stockLeft: null as number | null, expiry: 'Nov 2026', whyDiscounted: 'Limited batch',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBshr53s9hkB5kZ2x_23VFoRHRRSjM71kvonYYJXPm85oG5vmEMR91bwxoluGMHY48XZGk6weRH1-Qu-ErJ3hOcEMCinZ-bZUnHKeDxp2Pv5aXaUpaSTw_50V1_FdmoHR7CtbCeQRb4MoQ3ygu0-LkN_MQcnI_BSKwZdK20vu03YL8cJudqoet6UN-4QRQ_YBWRhYOwJ9r0KNV3F-7Xjhj4jk5kW3vo-XNfP-P_ppKZOne7JN2M0s8MiyaX9728rDeaBUfu1QHMQnPy',
    thumb: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBivcIM1H190qfwJrw5SfaIUZX4YkeyBwUm3Zp0D-53l9B5g999KveYiZ6Yia2_NzcyxSDCHxnZ3f9aRwsBT8XLxb2zf76JhCRVgi6Wj465YBD6muwcuQGqpxEnvLGcTjmPYtQCUqDxjw8xIdHwQD8XAs4U86dFyafRB5vBgS9Sjf9TglSofnHkE29bCr2u6RNC4dFiYsA5jvDQU7YxgeFTPbdbTZLfr6aG-aPBDMpfHDk1XPGZrigXN2JZVHhds6IVYkzG3iHGojqT',
  },
  {
    id: 'h2', name: 'Sandalwood Sculpting Comb', tagline: 'Handcrafted / Anti-static',
    description: 'Hand-carved from aromatic Mysore sandalwood to prevent static and gently massage the scalp.',
    curatorPrice: 2800, marketPrice: 4000, badge: 'Best for Dry Hair', badgeType: 'editorial' as const,
    stockPercent: 80, stockLeft: null as number | null, expiry: 'Jan 2027', whyDiscounted: 'Handcrafted',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDy_8CY8Rn3I-QrcdvYp8OA3dNawcmJhsTmGzK37ct_dGNW5FLMcbcJL-r5SqxTJrPzvX5eqwYCk3KERxCETacfZvkN40ekgFc9EcPGtbz2UC1210n33dqveN_EJjLB9tikxQ4ZM6f0YSxT6-_tS9xOvbYmuSkMEK1RSiLYoM_7429feW6HDcNGgV1R0CPNUC9gwo_rMtykLXPXwkVVgzY5zLAf73gNpsxgVVwahaXKt6n5GJR7c6bXwpabs_5Y2vPTTbAHR8CueEu',
    thumb: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDy_8CY8Rn3I-QrcdvYp8OA3dNawcmJhsTmGzK37ct_dGNW5FLMcbcJL-r5SqxTJrPzvX5eqwYCk3KERxCETacfZvkN40ekgFc9EcPGtbz2UC1210n33dqveN_EJjLB9tikxQ4ZM6f0YSxT6-_tS9xOvbYmuSkMEK1RSiLYoM_7429feW6HDcNGgV1R0CPNUC9gwo_rMtykLXPXwkVVgzY5zLAf73gNpsxgVVwahaXKt6n5GJR7c6bXwpabs_5Y2vPTTbAHR8CueEu',
  },
  {
    id: 'h3', name: 'Lotus Silk Serum', tagline: '30ml / Finishing Treatment',
    description: 'Weightless finishing serum with sacred lotus extract for a glass-like finish without buildup.',
    curatorPrice: 4800, marketPrice: 7500, badge: null, badgeType: null as string | null,
    stockPercent: 15, stockLeft: 3 as number | null, expiry: 'Oct 2026', whyDiscounted: 'Final batch',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJxd8ADcpZ6A65CR-O_VyGMWST8cls5dEPlIODdh_fUZKVACpbLx2RFtywdRPlBv_eqasBumJgniJl4ly7x-pNFM62wZgE33aOKJhy4DsWVjXzTSFpgaOmerJstJsEnQdnzE5KN3nVG1vC7yWZ55WnTjhVXzZWTkfNV8c1GyMntal27VOL-FVdUapMnlQrjWembAym1nIUxBKmzABxNthUl_PHnU6cmsXOBzqtXIt_v8aIFe8-iFH464kLaTBdlHtmraZpjeFLC17H',
    thumb: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJxd8ADcpZ6A65CR-O_VyGMWST8cls5dEPlIODdh_fUZKVACpbLx2RFtywdRPlBv_eqasBumJgniJl4ly7x-pNFM62wZgE33aOKJhy4DsWVjXzTSFpgaOmerJstJsEnQdnzE5KN3nVG1vC7yWZ55WnTjhVXzZWTkfNV8c1GyMntal27VOL-FVdUapMnlQrjWembAym1nIUxBKmzABxNthUl_PHnU6cmsXOBzqtXIt_v8aIFe8-iFH464kLaTBdlHtmraZpjeFLC17H',
  },
];

const PRODUCTS_SKIN = [
  {
    id: 's0', name: 'Saffron Brightening Elixir', tagline: '30ml / Radiance Serum',
    description: 'Cold-pressed Kashmiri saffron strands in a lightweight emulsion for luminous, even-toned skin.',
    curatorPrice: 5600, marketPrice: 8900, badge: 'Heritage Find', badgeType: 'tertiary' as const,
    stockPercent: 25, stockLeft: 4 as number | null, expiry: 'Mar 2027', whyDiscounted: 'Heritage batch',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvo_nOCMI0_jQeSaO86dMIyvdCl1sWJqc6_2THuR4PsVRm0mBYUXYL1V-6Twoxd3kclGYIV2ELnmkM7mAQ_lLKFrN1VWhJXRuEvsVVXIdN3ru__9oNdkqhUfH1UtKu6oYp6adsJqRjK8Z4S1NuMJjGkmKUNwXsVKPfMok1YH56i5MQaf4cbfoipQ1AH5FDtp7QLyKzXPcalIOyKmbQe5kHoOaCsFsCWTALSSO2CABrUhD7ZoDwiw81BnBf7um9xvVoZD1zH_UwzwhX',
    thumb: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvo_nOCMI0_jQeSaO86dMIyvdCl1sWJqc6_2THuR4PsVRm0mBYUXYL1V-6Twoxd3kclGYIV2ELnmkM7mAQ_lLKFrN1VWhJXRuEvsVVXIdN3ru__9oNdkqhUfH1UtKu6oYp6adsJqRjK8Z4S1NuMJjGkmKUNwXsVKPfMok1YH56i5MQaf4cbfoipQ1AH5FDtp7QLyKzXPcalIOyKmbQe5kHoOaCsFsCWTALSSO2CABrUhD7ZoDwiw81BnBf7um9xvVoZD1zH_UwzwhX',
  },
  {
    id: 's1', name: 'Turmeric Glow Mask', tagline: '100g / Brightening Treatment',
    description: 'Wild turmeric and chickpea flour mask with neem extract for radiant, clarified skin.',
    curatorPrice: 3200, marketPrice: 5100, badge: 'Thrifty Luxury', badgeType: 'secondary' as const,
    stockPercent: 60, stockLeft: null as number | null, expiry: 'Feb 2027', whyDiscounted: 'Seasonal batch',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUZDmo-OxlQVMZzhQBdhd5wkARMqZ04tAelIVgjUy_qJCjo34bD3Tq9TJ1xeoezbs-6pNepj9CKP5wVc4aXeKKesQpTTABppF0yBBLKJL2pYKM6xNu_nnEba4gvwFu-8pYHUOz4WlfacajQavD7WwDMys2MfnKHjp4uL4xpjlc7h0kk-zns9fDGkfkcRinSkZRZxNr1rCw33mUmp6sGnVNRL8qR-MixLzoxTi_hsWgAvu9XKgLzuT_gLxbjnVPLYtaH7OVLoOoolvx',
    thumb: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUZDmo-OxlQVMZzhQBdhd5wkARMqZ04tAelIVgjUy_qJCjo34bD3Tq9TJ1xeoezbs-6pNepj9CKP5wVc4aXeKKesQpTTABppF0yBBLKJL2pYKM6xNu_nnEba4gvwFu-8pYHUOz4WlfacajQavD7WwDMys2MfnKHjp4uL4xpjlc7h0kk-zns9fDGkfkcRinSkZRZxNr1rCw33mUmp6sGnVNRL8qR-MixLzoxTi_hsWgAvu9XKgLzuT_gLxbjnVPLYtaH7OVLoOoolvx',
  },
  {
    id: 's2', name: 'Rosehip Renewal Oil', tagline: '50ml / Night Recovery',
    description: 'Cold-pressed rosehip seed oil enriched with vetiver and jasmine sambac for overnight skin repair.',
    curatorPrice: 4100, marketPrice: 6500, badge: 'Best for Dullness', badgeType: 'editorial' as const,
    stockPercent: 45, stockLeft: null as number | null, expiry: 'Apr 2027', whyDiscounted: 'Small batch',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNLnMhpVgwQKKKJNbhcz8Evqob_AnCdMkL6dL6iHFN_4c_LVa5V8OaOQEfy0Qbo3p98RQqR3Qsfd0Jl_beOjzPfdKappUuKn6f5Ke37VPNDHeKnx588GuKfw9GRPspZwV-arky1x9gLnLD2llS0lXfAiTnf0Eugi-c6GcVXN-yGVFYDK6VeZ7Vd2iKAYF1LwizXQdCgWQTjdKb9rQ9Jp74gcZET8tQV3DqPg1eR6F9Ks_nvgPb5MNFfEBENH4E0NSt0jelThAs9dn0',
    thumb: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNLnMhpVgwQKKKJNbhcz8Evqob_AnCdMkL6dL6iHFN_4c_LVa5V8OaOQEfy0Qbo3p98RQqR3Qsfd0Jl_beOjzPfdKappUuKn6f5Ke37VPNDHeKnx588GuKfw9GRPspZwV-arky1x9gLnLD2llS0lXfAiTnf0Eugi-c6GcVXN-yGVFYDK6VeZ7Vd2iKAYF1LwizXQdCgWQTjdKb9rQ9Jp74gcZET8tQV3DqPg1eR6F9Ks_nvgPb5MNFfEBENH4E0NSt0jelThAs9dn0',
  },
  {
    id: 's3', name: 'Kesar Radiance Cream', tagline: '50ml / Daily Illuminator',
    description: 'Saffron-infused moisturizing cream with sandalwood distillate for a lit-from-within glow.',
    curatorPrice: 3800, marketPrice: 6200, badge: null, badgeType: null as string | null,
    stockPercent: 20, stockLeft: 5 as number | null, expiry: 'May 2027', whyDiscounted: 'Clearance',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPXqbZ1p5mKKivsZpI9Ljid0GR6XLCaNp8rBssqaT1bjgJCJBF6CyhrmoQkkERa7KcohnwCMt8NXUzSbNRJkpcOCznV2v4rnnLwCw1BHG1i5jsGo3ed7DvZE4dQH2P4GB5uBW34A_wdTq1f9iga-g6rnzXl0FrnhyzvjUke8VVVXPHtuwBuIMUMxF2P9nlSQtzZKkMveIcpRTiDP_GrqXuHzO_7slR7f8JKaseWxPb-8OB6gRKF3RRAAPfohWLDi6p4JoZglE8zV3W',
    thumb: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPXqbZ1p5mKKivsZpI9Ljid0GR6XLCaNp8rBssqaT1bjgJCJBF6CyhrmoQkkERa7KcohnwCMt8NXUzSbNRJkpcOCznV2v4rnnLwCw1BHG1i5jsGo3ed7DvZE4dQH2P4GB5uBW34A_wdTq1f9iga-g6rnzXl0FrnhyzvjUke8VVVXPHtuwBuIMUMxF2P9nlSQtzZKkMveIcpRTiDP_GrqXuHzO_7slR7f8JKaseWxPb-8OB6gRKF3RRAAPfohWLDi6p4JoZglE8zV3W',
  },
];

const PRODUCTS_FRAGRANCE = [
  {
    id: 'f0', name: 'Oud Midnight Attar', tagline: '12ml / Signature Essence',
    description: 'Slow-distilled Assamese oud in a sandalwood base — dark, meditative, unmistakable.',
    curatorPrice: 7200, marketPrice: 11500, badge: 'Heritage Find', badgeType: 'tertiary' as const,
    stockPercent: 15, stockLeft: 3 as number | null, expiry: 'Dec 2028', whyDiscounted: 'Heritage distillation',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDfoPsKn3V870fbV4xd2Rezgc1XvKt7MGf2UCH6O69SMl8Df4UzdLgWnVyhnib-DjJz8KnKEYDJW7QZkC9BkdkWV9cdWxkHkKhUtI5bHAf1UAtEG5Sejroxkjcr6xl-udsI0Q_VG4ZFxsUgc_LID43gjj-beEhgHTWKntu4Axjlae7Gs1AaxITpiebc-FR8bar85Niqrd4_erHfFMb401FW8zpnyLMAyAMSoB7g5pPBY44utxHRBALvAVJPnT_z-9ne66vvdCvlk1P-',
    thumb: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDfoPsKn3V870fbV4xd2Rezgc1XvKt7MGf2UCH6O69SMl8Df4UzdLgWnVyhnib-DjJz8KnKEYDJW7QZkC9BkdkWV9cdWxkHkKhUtI5bHAf1UAtEG5Sejroxkjcr6xl-udsI0Q_VG4ZFxsUgc_LID43gjj-beEhgHTWKntu4Axjlae7Gs1AaxITpiebc-FR8bar85Niqrd4_erHfFMb401FW8zpnyLMAyAMSoB7g5pPBY44utxHRBALvAVJPnT_z-9ne66vvdCvlk1P-',
  },
  {
    id: 'f1', name: 'Jasmine Twilight Mist', tagline: '100ml / Evening Veil',
    description: 'A featherlight body and hair mist of night-blooming jasmine with a whisper of tuberose.',
    curatorPrice: 3400, marketPrice: 5400, badge: 'Thrifty Luxury', badgeType: 'secondary' as const,
    stockPercent: 50, stockLeft: null as number | null, expiry: 'Aug 2027', whyDiscounted: 'Seasonal distillation',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAf9Gggh2tG5vKP9P52VGQVlRgekL9wPab2mrr2L2S_hpgIdTVBcxlCfEi-nczzseZMNaO_tWSraWUc975CrGa2bjoGM5aiS3_2dekTqkO5jl-dBFQs-Kg_T22lBLt1FRwy8DbmAOVvAcJ6OeGVcfRVdOCT4RQbU0fewMpMMIF6L4AALmVE_Sk1tGJKQLGtbMirV_KScsodU8bBxKZRm7Vy_FGPXR2KjxGahPk7l0RyeWzSJEYmTruas2nZg0SU8YLaQvRc7LdA9cWN',
    thumb: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAf9Gggh2tG5vKP9P52VGQVlRgekL9wPab2mrr2L2S_hpgIdTVBcxlCfEi-nczzseZMNaO_tWSraWUc975CrGa2bjoGM5aiS3_2dekTqkO5jl-dBFQs-Kg_T22lBLt1FRwy8DbmAOVvAcJ6OeGVcfRVdOCT4RQbU0fewMpMMIF6L4AALmVE_Sk1tGJKQLGtbMirV_KScsodU8bBxKZRm7Vy_FGPXR2KjxGahPk7l0RyeWzSJEYmTruas2nZg0SU8YLaQvRc7LdA9cWN',
  },
  {
    id: 'f2', name: 'Sandalwood Heritage Perfume', tagline: '15ml / Timeless Signature',
    description: 'Pure Mysore sandalwood oil aged for 18 months — the cornerstone of any fragrance ritual.',
    curatorPrice: 8900, marketPrice: 14000, badge: 'Best for Gifting', badgeType: 'editorial' as const,
    stockPercent: 10, stockLeft: 2 as number | null, expiry: 'Jun 2029', whyDiscounted: 'Limited reserve',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWgebw0zMrkamRD4BqB9pjPw3bT4FD5Nb3pPgZUiOyQSO0YAHzcnvjLiHEOFc_xEPFfd4JPntfH21BauCZHzYF_mTNnAI7YRT3PSE57kQw4FRZPWHgqpt82p_TCFnlqGZijaJ0FXKetK0S_bgrGF21bczLlsqaQS9WBWD5vaL5r-MN-2LzRc7u46DcVXRVM7FsSzjIMNNxylykQspWIWT2M9tZgBYCTPXDRZJC84OgG2lopsFotgYOmv92AS0zcVb5kq-MHCpicJCm',
    thumb: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWgebw0zMrkamRD4BqB9pjPw3bT4FD5Nb3pPgZUiOyQSO0YAHzcnvjLiHEOFc_xEPFfd4JPntfH21BauCZHzYF_mTNnAI7YRT3PSE57kQw4FRZPWHgqpt82p_TCFnlqGZijaJ0FXKetK0S_bgrGF21bczLlsqaQS9WBWD5vaL5r-MN-2LzRc7u46DcVXRVM7FsSzjIMNNxylykQspWIWT2M9tZgBYCTPXDRZJC84OgG2lopsFotgYOmv92AS0zcVb5kq-MHCpicJCm',
  },
  {
    id: 'f3', name: 'Vetiver & Bergamot Noir', tagline: '10ml / Meditation Blend',
    description: 'Haitian vetiver root fused with Calabrian bergamot — grounding yet luminous.',
    curatorPrice: 4500, marketPrice: 7200, badge: null, badgeType: null as string | null,
    stockPercent: 35, stockLeft: null as number | null, expiry: 'Nov 2027', whyDiscounted: 'Small batch',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBko4IOkB7i0oOY91Q9GMcwV8Jkz7jOHsNHqJMnPbtWo-4K4VF5ZLW2UWuFqw83xLhwSh0RZjnG9g48PANPO-vt09mK6YWMVs-Epq8kLYGsFAgmUfXHc_13YttLspecl7vcaDjf4b5oteaffxPZyXE3nk91JzEy2jp8SlHMXcOOYsapgOwpvlYr4o2cJrIBhONqW8mDHeiXpBLVvSFTo6DbZHLrXq9iysp0z9agC4gONCO66EZjYsxVg-eDFkqBMOiFe8nzGakGk_px',
    thumb: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBko4IOkB7i0oOY91Q9GMcwV8Jkz7jOHsNHqJMnPbtWo-4K4VF5ZLW2UWuFqw83xLhwSh0RZjnG9g48PANPO-vt09mK6YWMVs-Epq8kLYGsFAgmUfXHc_13YttLspecl7vcaDjf4b5oteaffxPZyXE3nk91JzEy2jp8SlHMXcOOYsapgOwpvlYr4o2cJrIBhONqW8mDHeiXpBLVvSFTo6DbZHLrXq9iysp0z9agC4gONCO66EZjYsxVg-eDFkqBMOiFe8nzGakGk_px',
  },
];

const CATEGORY_DATA: Record<Category, { title: string; subtitle: string; curatorNote: { quote: string; attribution: string }; products: Product[] }> = {
  hair: {
    title: 'Hair Ritual Collection',
    subtitle: 'Rooted in Ayurvedic tradition and refined for the modern eye. Select your foundation, nourishment, and finish to curate a ritual that honors your heritage.',
    curatorNote: { quote: 'Luxury is not found in the price, but in the time we take to honor ourselves. These formulas are sourced from generational growers across the island, ensuring that your thrifty choices never compromise on the sacredness of the ritual.', attribution: 'Dr. Amara Silva' },
    products: PRODUCTS_HAIR,
  },
  skin: {
    title: 'Skin Ritual Collection',
    subtitle: 'Centuries-old botanical wisdom meets modern dermal science. Each formulation in this collection has been curated from heritage apothecaries for luminous, resilient skin.',
    curatorNote: { quote: 'The skin remembers what the mind forgets. These preparations carry the intelligence of turmeric, saffron, and rose — ingredients that have sustained beauty rituals across the subcontinent for millennia.', attribution: 'Priya Wickramasinghe' },
    products: PRODUCTS_SKIN,
  },
  fragrance: {
    title: 'Fragrance Ritual Collection',
    subtitle: 'Attars, mists, and signatures crafted from rare botanical essences. These are not perfumes — they are personal ceremonies captured in glass.',
    curatorNote: { quote: 'A fragrance should arrive before you and linger after you leave. Our attars are slow-distilled over wood fires in Kannauj, exactly as they have been for eight centuries. There is no faster way to make them.', attribution: 'Farid Hussain Khatri' },
    products: PRODUCTS_FRAGRANCE,
  },
};

const CURATOR_PORTRAIT = 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1B81cycUiLrWgg7sUTgqFNXZ1ZGYKXamCshoR2fcS5e8KHEb3zioj4AeY--p68CMaCISeDwORROYgxyMbCWge8CH_EePNQ6zBasEs282M9efCuWBg021Led_tsaxkAEzuIrzSTVuqcSI5MK-VR1WePtGirmu61nmjGzKT2AfskYhz0z2Aa7YCbnjmNEVarpO5qMfftxcynvOeqWo_lFiENaVvHSWmkkqaODtZ10zT-bjJVYasmKD6ixz_BQebbqHqZFHsSsay7xIP';

const formatLKR = (n: number) => `LKR ${n.toLocaleString('en-US')}`;

const NAV_ITEMS: { label: string; icon: string; category: Category }[] = [
  { label: 'Hair Ritual', icon: 'spa', category: 'hair' },
  { label: 'Skin Ritual', icon: 'face_6', category: 'skin' },
  { label: 'Fragrance', icon: 'auto_awesome', category: 'fragrance' },
];

const Icon = ({ name, filled = false, className = '' }: { name: string; filled?: boolean; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`} style={filled ? { fontVariationSettings: "'FILL' 1" } : {}}>
    {name}
  </span>
);

export default function RitualBuilder() {
  const { category: categoryParam } = useParams<{ category?: string }>();
  const category: Category = (['hair', 'skin', 'fragrance'].includes(categoryParam || '') ? categoryParam : 'hair') as Category;

  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [orderType, setOrderType] = useState<'one-time' | 'subscribe'>('one-time');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const products = CATEGORY_DATA[category].products;

  const toggleProduct = (id: string) => {
    setSelectedProducts((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };
  const toggleFavorite = (id: string) => {
    setFavorites((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };
  const removeProduct = (id: string) => {
    setSelectedProducts((prev) => { const n = new Set(prev); n.delete(id); return n; });
  };

  const allProducts = useMemo(() => [...PRODUCTS_HAIR, ...PRODUCTS_SKIN, ...PRODUCTS_FRAGRANCE], []);
  const selectedItems = allProducts.filter((p) => selectedProducts.has(p.id));
  const subtotal = selectedItems.reduce((s, p) => s + p.curatorPrice, 0);
  const discount = selectedItems.length >= 3 ? Math.round(subtotal * 0.15) : 0;
  const total = subtotal - discount;
  const bundleMin = 3;
  const needsMore = Math.max(0, bundleMin - selectedProducts.size);

  const catData = CATEGORY_DATA[category];

  return (
    <div className="bg-background text-on-surface flex flex-col h-screen overflow-hidden selection:bg-secondary-fixed dark:selection:bg-secondary-fixed-dim">
      <Header />

      <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
        {/* Left Sidebar */}
        <aside className="flex flex-col py-6 lg:py-10 px-6 space-y-4 lg:space-y-8 w-full lg:w-80 flex-shrink-0 bg-surface-container overflow-y-auto no-scrollbar border-b lg:border-b-0 lg:border-r border-outline-variant/10">
          <div className="mb-4">
            <h2 className="font-noto-serif italic text-secondary  text-lg">The Ritual Builder</h2>
            <p className="font-manrope text-xs uppercase tracking-widest text-on-surface/60 ">Curating your personal care</p>
          </div>

          <nav className="flex-1 space-y-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.category}
                to={`/ritual-builder/${item.category}`}
                className={`flex items-center space-x-4 py-3 px-4 transition-colors rounded-r-full ${
                  category === item.category
                    ? 'bg-surface-variant  text-primary  font-bold scale-95'
                    : 'text-on-surface/60  hover:bg-surface-variant/50 '
                }`}
              >
                <Icon name={item.icon} filled={category === item.category} className="text-base" />
                <span className="font-manrope text-sm uppercase tracking-widest">{item.label}</span>
              </Link>
            ))}
            <Link to="/checkout" className="flex items-center space-x-4 py-3 px-4 text-on-surface/60  hover:bg-surface-variant/50  transition-colors rounded-r-full border-t border-outline-variant/10 mt-4 pt-4">
              <Icon name="auto_stories" className="text-base" />
              <span className="font-manrope text-sm uppercase tracking-widest">Your Selection</span>
            </Link>
          </nav>

          {/* Bundle Progress */}
          <div className="pt-6 border-t border-outline-variant/15 space-y-4">
            {needsMore > 0 ? (
              <div className="bg-primary-container  p-4 rounded-lg text-on-primary  shadow-sm">
                <p className="text-xs uppercase tracking-widest opacity-80 mb-1">Bundle Progress</p>
                <div className="h-1 bg-surface/20  rounded-full mb-3">
                  <div className="h-1 bg-secondary-fixed-dim  rounded-full transition-all duration-500" style={{ width: `${Math.min((selectedProducts.length / bundleMin) * 100, 100)}%` }} />
                </div>
                <p className="font-noto-serif text-sm italic">Add {needsMore} more for 15% off</p>
              </div>
            ) : (
              <div className="bg-primary-container  p-4 rounded-lg text-on-primary  shadow-sm">
                <div className="flex items-center space-x-2 mb-1">
                  <Icon name="auto_awesome" filled className="text-sm text-secondary-fixed-dim " />
                  <p className="text-xs uppercase tracking-widest opacity-80">Bundle Discount Activated</p>
                </div>
                <p className="font-noto-serif text-sm italic">15% off your entire ritual</p>
              </div>
            )}
            <Link
              to={selectedProducts.size > 0 ? '/order-confirmed' : '#'}
              onClick={(e) => selectedProducts.size === 0 && e.preventDefault()}
              className={`block w-full text-center py-3 px-6 rounded-md uppercase tracking-widest text-xs font-bold transition-colors duration-300 ${
                selectedProducts.size > 0
                  ? 'bg-secondary  text-on-secondary  hover:bg-on-secondary-container'
                  : 'bg-surface-container-high  text-outline cursor-not-allowed'
              }`}
            >
              {selectedProducts.size > 0 ? 'Complete Ritual' : 'Select Products'}
            </Link>
          </div>

          <div className="space-y-4 pt-4">
            <Link to="/support" className="flex items-center space-x-3 text-xs font-light text-on-surface/70  hover:text-secondary  transition-colors">
              <Icon name="loyalty" className="text-sm" />
              <span>Subscription Benefits</span>
            </Link>
            <Link to="/support" className="flex items-center space-x-3 text-xs font-light text-on-surface/70  hover:text-secondary  transition-colors">
              <Icon name="help_outline" className="text-sm" />
              <span>Help</span>
            </Link>
          </div>
        </aside>

        {/* Scrollable center: main + footer */}
        <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Product Canvas */}
        <main className="flex-1 px-6 md:px-10 lg:px-12 py-12">
          <header className="mb-12 max-w-4xl">
            <h1 className="font-noto-serif text-5xl font-black text-primary  leading-tight mb-4">{catData.title}</h1>
            <p className="text-on-surface-variant  font-manrope max-w-2xl leading-relaxed">{catData.subtitle}</p>
          </header>

          {/* Editorial Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12 mb-20">
            {products.map((product) => (
              <article key={product.id} className="group relative bg-surface-container-low  hover:bg-surface-container-high  transition-colors duration-500 rounded-sm">
                {product.badge && product.badgeType === 'editorial' && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="font-noto-serif italic text-xs text-on-surface-variant  bg-surface  backdrop-blur-sm px-2 py-1 rounded">{product.badge}</span>
                  </div>
                )}
                {product.badge && product.badgeType !== 'editorial' && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className={`stamp-badge px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] ${product.badgeType === 'tertiary' ? 'bg-tertiary-container text-on-surface' : 'bg-secondary text-on-surface'}`}>{product.badge}</div>
                  </div>
                )}
                <div className="aspect-[4/5] overflow-hidden bg-surface-variant/30  p-8 flex items-center justify-center">
                  <img alt={product.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-700" src={product.image} />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-noto-serif text-xl text-primary  leading-none">{product.name}</h3>
                    <button onClick={() => toggleFavorite(product.id)} className="text-outline-variant  hover:text-secondary  transition-colors p-2 min-w-[44px] min-h-[44px] flex items-center justify-center -mr-2 -mt-2">
                      <Icon name="favorite" filled={favorites.has(product.id)} className={favorites.has(product.id) ? 'text-secondary ' : ''} />
                    </button>
                  </div>
                  <span className="font-manrope text-sm font-semibold text-secondary ">{formatLKR(product.curatorPrice)}</span>
                  <p className="mt-2 text-xs text-on-surface-variant/80  font-light">{product.description}</p>
                  {product.stockLeft && (
                    <div className="flex items-center gap-2 mt-4">
                      <div className="flex-1 h-1 bg-surface-container-high  rounded-full overflow-hidden">
                        <div className="h-full bg-secondary  rounded-full" style={{ width: `${product.stockPercent}%` }} />
                      </div>
                      <span className="text-xs text-secondary  font-black">Only {product.stockLeft} left</span>
                    </div>
                  )}
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-3 text-xs text-on-surface-variant/60 ">
                    <span className="flex items-center gap-0.5 text-primary/70 "><Icon name="verified" className="text-xs" filled /> Auth</span>
                    <span>·</span>
                    <span>Exp: {product.expiry}</span>
                    <span>·</span>
                    <span className="flex items-center gap-0.5 text-secondary/70 "><Icon name="sell" className="text-xs" /> {product.whyDiscounted}</span>
                  </div>
                  <button
                    onClick={() => toggleProduct(product.id)}
                    className={`w-full py-3 mt-4 text-xs uppercase tracking-widest font-bold border transition-all ${
                      selectedProducts.has(product.id)
                        ? 'border-primary  bg-primary  text-on-primary '
                        : 'border-primary/10  text-primary  hover:border-secondary  hover:text-secondary '
                    }`}
                  >
                    {selectedProducts.has(product.id) ? 'Added to Ritual' : 'Add to Ritual'}
                  </button>
                </div>
              </article>
            ))}
          </section>

          {/* Curator's Note */}
          <section className="p-12 md:p-16 bg-surface-container-high  border-t border-outline-variant/10  flex flex-col md:flex-row gap-12 items-center rounded-xl shadow-sm">
            <div className="w-32 h-32 rounded-full overflow-hidden flex-shrink-0 grayscale opacity-80 border-4 border-surface ">
              <img alt="Curator" className="w-full h-full object-cover" src={CURATOR_PORTRAIT} />
            </div>
            <div className="flex-1">
              <span className="font-noto-serif italic text-secondary  text-sm block mb-2">A Note from the Curator</span>
              <h4 className="font-noto-serif text-2xl text-primary  mb-4">Honoring the Routine</h4>
              <p className="text-on-surface-variant  leading-relaxed italic text-sm md:text-base">&ldquo;{catData.curatorNote.quote}&rdquo;</p>
              <p className="mt-4 font-noto-serif text-sm font-bold text-primary ">&mdash; {catData.curatorNote.attribution}</p>
            </div>
          </section>

          {/* Mobile FAB */}
          <div className="lg:hidden fixed bottom-6 right-6 z-50">
            <Link to={selectedProducts.size > 0 ? '/order-confirmed' : '#'} onClick={(e) => selectedProducts.size === 0 && e.preventDefault()}>
              <button className="bg-primary  text-on-surface  w-14 h-14 rounded-full shadow-2xl flex items-center justify-center border-4 border-background  group">
                <Icon name="auto_stories" className="text-2xl group-hover:scale-110 transition-transform" />
                {selectedProducts.size > 0 && (
                  <span className="absolute -top-1 -right-1 bg-secondary  text-on-surface  text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">{selectedProducts.size}</span>
                )}
              </button>
            </Link>
          </div>
        </main>

          {/* Footer */}
          <footer className="bg-surface w-full py-12 border-t-[0.5px] border-outline-variant/15">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-8">
              <p className="font-manrope text-xs font-light text-on-surface-variant/60  mb-6 md:mb-0">&copy; 2024 The Heritage Curator. Thrifty Luxury, Rooted in Tradition.</p>
              <div className="flex flex-wrap justify-center gap-8 font-manrope text-xs font-light">
                <Link to="/support" className="text-on-surface-variant/70  hover:text-secondary  transition-colors duration-300">Privacy Policy</Link>
                <Link to="/support" className="text-on-surface-variant/70  hover:text-secondary  transition-colors duration-300">Sourcing Ethics</Link>
                <Link to="/support" className="text-on-surface-variant/70  hover:text-secondary  transition-colors duration-300">Wholesale</Link>
                <Link to="/support" className="text-on-surface-variant/70  hover:text-secondary  transition-colors duration-300 underline">Ritual Guide</Link>
              </div>
            </div>
          </footer>
        </div>

        {/* Right Summary Sidebar */}
        <aside className="hidden xl:flex flex-col w-96 flex-shrink-0 bg-surface-container-lowest border-l border-outline-variant/10 shadow-[-10px_0_30px_rgba(28,28,23,0.03)] overflow-y-auto no-scrollbar">
          <div className="p-8 pb-4">
            <h2 className="font-noto-serif text-2xl text-primary  mb-1">Your Ritual</h2>
            <p className="text-xs uppercase tracking-[0.2em] text-on-surface/50 ">Selections so far</p>
          </div>

          <div className="flex-1 px-8 space-y-6 overflow-y-auto py-4 no-scrollbar">
            {selectedItems.length === 0 ? (
              <div className="text-center py-8">
                <Icon name="spa" className="text-4xl text-outline-variant/30 " />
                <p className="text-sm text-on-surface-variant/60  mt-3 italic font-light">Add products from the catalog to build your ritual</p>
              </div>
            ) : (
              selectedItems.map((item) => (
                <div key={item.id} className="flex gap-4 group">
                  <div className="w-16 h-20 bg-surface-container-low  flex-shrink-0 p-2 overflow-hidden">
                    <img alt={item.name} className="w-full h-full object-contain mix-blend-multiply" src={item.thumb} />
                  </div>
                  <div className="flex-1 border-b border-outline-variant/10  pb-4">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-xs font-bold text-primary  uppercase tracking-wider">{item.name}</h4>
                      <button onClick={() => removeProduct(item.id)} className="text-on-surface/30  hover:text-error  transition-colors">
                        <Icon name="close" className="text-sm" />
                      </button>
                    </div>
                    <p className="text-xs text-on-surface/60  mb-2">{item.tagline}</p>
                    <span className="text-xs font-semibold text-secondary ">{formatLKR(item.curatorPrice)}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Bottom Pricing & Checkout */}
          <div className="p-8 bg-surface-container-low  border-t border-outline-variant/20 ">
            {selectedItems.length > 0 && (
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-xs font-medium text-on-surface/60 ">
                  <span>Subtotal</span>
                  <span>{formatLKR(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-xs font-bold text-secondary ">
                    <span className="flex items-center"><Icon name="auto_awesome" className="text-xs mr-1" />Ritual Bundle Discount</span>
                    <span>- {formatLKR(discount)} (15%)</span>
                  </div>
                )}
                <div className="pt-3 border-t border-outline-variant/10  flex justify-between items-center">
                  <span className="font-noto-serif text-lg text-primary  font-black">Total</span>
                  <span className="font-noto-serif text-xl text-primary  font-black">{formatLKR(total)}</span>
                </div>
              </div>
            )}

            <Link
              to={selectedProducts.size > 0 ? '/order-confirmed' : '#'}
              onClick={(e) => selectedProducts.size === 0 && e.preventDefault()}
              className={`block w-full text-center py-4 rounded-md font-bold text-xs uppercase tracking-[0.2em] shadow-md transition-all duration-300 ${
                selectedProducts.size > 0
                  ? 'bg-primary  text-on-primary  hover:translate-y-[-1px] active:translate-y-0'
                  : 'bg-surface-container-high  text-outline cursor-not-allowed'
              }`}
            >
              {selectedProducts.size > 0 ? 'Secure Checkout' : 'Select Products First'}
            </Link>

            {selectedProducts.size >= bundleMin && (
              <p className="text-center text-xs text-on-surface/40  mt-3 italic font-light">Free delivery included with this ritual bundle.</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}