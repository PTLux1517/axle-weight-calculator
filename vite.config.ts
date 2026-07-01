/*
Axle Weight Calculator - A job site specific tool for calculating load weight
distribution, tailored to the needs of such anonymous company, but also available
open source under the following AGPL license for any who may also find it useful.

Copyright (C) 2026 Cory Tomlinson

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://gnu.org>.
*/

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/axle-weight-calculator/',
})
