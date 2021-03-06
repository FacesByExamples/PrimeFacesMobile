/*
 * Copyright 2009-2011 Prime Technology.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.primefaces.mobile.renderkit;

import java.io.IOException;
import java.util.Map;
import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;
import javax.faces.context.ResponseWriter;
import org.primefaces.component.button.Button;
import org.primefaces.mobile.util.MobileUtils;
import org.primefaces.renderkit.CoreRenderer;

public class ButtonRenderer extends CoreRenderer {

    @Override
    public void encodeEnd(FacesContext context, UIComponent component) throws IOException {
        ResponseWriter writer = context.getResponseWriter();
        Button button = (Button) component;
        Map<String,Object> attrs = button.getAttributes();
        Object inline = attrs.get("inline");

        writer.startElement("a", component);
        writer.writeAttribute("id", button.getClientId(context), null);
        writer.writeAttribute("href", "javascript:void(0)", null);
        writer.writeAttribute("data-role", "button", null);        

        if(inline != null && Boolean.valueOf(inline.toString())) writer.writeAttribute("data-inline", "true", null);
        if (button.getIcon() != null) {
            writer.writeAttribute("data-iconpos", button.getIconPos(), null);
            writer.writeAttribute("data-icon", button.getIcon(), null);
        }
        if(button.getStyle() != null) writer.writeAttribute("style", button.getStyle(), null);
        if(button.getStyleClass() != null) writer.writeAttribute("class", button.getStyleClass(), null);
        
        writer.writeAttribute("onclick", buildOnclick(context, button), null);

        writer.writeText(button.getValue(), null);
        
        writer.endElement("a");
    }
    
    /**
     * Resolves to local view, external page or jsf navigation
     */
    protected String buildOnclick(FacesContext context, Button button) {
        String href = button.getHref();
        String userOnclick = button.getOnclick();
        StringBuilder onclick = new StringBuilder();
        String url = null;
        
        if(userOnclick != null) {
            onclick.append(userOnclick).append(";");
        }
        
        if(href != null) {
            if(href.startsWith("#")) {
                onclick.append(MobileUtils.buildNavigation(href));
                
                return onclick.toString();              //local view
            }
            else {
                url = getResourceURL(context, href);    //external page
            }  
        }
        
        if(url != null) {
            onclick.append("window.location.href='").append(url).append("';");
        }
        
        return onclick.toString();
    }
}
