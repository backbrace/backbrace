/**
 * @license
 * Copyright Paul Fisher <paulfisher53@gmail.com> All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://backbrace.io/mitlicense
 */

/**
 * Guide Page Template
 */
export const GUIDE = `<div style="min-height:60vh">{{githublink}}{{html}}</div>`;

/**
 * API Home Page Template
 */
export const API_HOME = `<h1 style="margin: 30px;">API List</h1>
<div bb-repeat="true" class="col-sm-12 col-md-6 col-lg-4"
    style="line-height: 3em; font-size: 1em; display:inline-block; margin: 0;">
    <label class="api-type {{kind}}" style="margin-right: 10px;"><a route="api/{{name}}">{{kindInitials}}</label>
    {{name}} {{access}}</a>
</div>`;

/**
 * API Page Template
 */
export const API = `<h1 class="api-heading">{{name}}</h1>
<label class="api-type {{kind}}">{{access}} {{kind}}&nbsp;</label>
{{githubLinks}}<section class="desc">{{desc}}</section>
<div class="api-body">
{{overview}}
{{constructors}}
{{properties}}
{{methods}}
</div>`;

/**
 * API Member Template
 */
export const API_MEMBER = `<a id="{{name}}"></a><table class="method-table"><thead><tr><th><div>{{name}}
<a title="Link to this heading" class="heading-link" aria-hidden="true" href="{{browserPath}}#{{name}}
"><i class="mdi mdi-link"></i></a>
{{githubLinks}}
</div></th></tr></thead>
<tbody>
<tr {{showDesc}}><td class="desc">{{desc}}</td></tr>
<tr><td class="sig"><pre class="source overview">{{signature}}</pre></td></tr>
<tr {{showParams}}><td class="desc"><h5>Parameters</h5><table style="width:100%">{{paramRows}}</table></td></tr>
<tr {{showReturns}}><td class="desc"><h5>Returns</h5><br><code>{{returnsType}}</code><br>{{returnsDesc}}</td></tr>
</table>`;

/**
 * Component Template.
 */
export const COMPONENT = `<div class="col-sm-12 col-md-6 col-lg-4"
style="line-height: 3em; font-size: 1em; display:inline-block; margin: 0;">
<a route="components/{{name}}"><label class="comp-type {{type}}" style="margin-right: 10px;">{{initals}}</label>
{{caption}}</a>
</div>`;
