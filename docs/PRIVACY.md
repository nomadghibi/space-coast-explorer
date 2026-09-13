# Privacy

Do not retain unnecessary precise GPS history. Do not log passwords, auth tokens, or unnecessary raw precise location history.

M2 location behavior is foreground-only and optional. The app asks for location only after explaining the value to the visitor, and denial never blocks manual completion.

Raw GPS readings are processed locally for stop proximity. M2 stores tour progress in localStorage,
but not continuous movement history. Analytics may record tour start and completion events; they
must not include second-by-second location trails, latitude, longitude, or location accuracy.
