# Open product-owner questions

These questions do not block the current documentation work. They should be answered before the dependent production phase.

## 1. Product and repository name

The user-facing product is **Rondo**, while the organization/repository and package history use **Rando** in several places.

Decision needed:

- keep Rondo as the product and retain Rando only as an internal organization/repository name;
- rename repository/package/infrastructure to Rondo before production;
- change the user-facing product name to Rando.

Recommended default: keep the user-facing Rondo brand and normalize production-facing technical names before domains, app stores, contracts, or trademark work.

## 2. First real-music path

Decision needed:

- direct artist/label uploads first;
- licensed catalog provider first;
- hybrid from the beginning;
- defer until a launch territory and catalog target are defined.

This determines ingestion, rights, playback, moderation, support, and cost architecture.

## 3. Payment/value model

Decision needed:

- listener subscription;
- artist/label tools or services;
- direct support, memberships, tips, tickets, or merchandise;
- transparent hybrid;
- no payments in initial V1.

This must be decided before entitlements, checkout, tax, refunds, store policy, or payouts are designed.

## 4. Optional listening extras

The candidate includes extras/reveals after genuine listening time while keeping all music and required information open.

Decision needed after testing:

- keep the feature;
- simplify it to always-available liner context;
- remove it entirely.

## 5. Launch territory and platforms

Needed before production licensing and payments:

- initial country/region;
- web-only V1 or simultaneous native mobile;
- supported currencies and languages;
- explicit-content and age requirements.

## 6. Candidate integration strategy

After the candidate is green and accepted:

- squash the experience into a clean release commit; or
- retain detailed history and merge normally.

Recommended default: preserve full branch history until acceptance, then squash the noisy diagnostic history into a clear release commit with complete QA evidence.
