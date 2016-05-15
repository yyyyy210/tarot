package com.myee.tarot.web.files.controller;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.myee.tarot.core.web.JQGridResponse;
import com.myee.tarot.web.files.FileDTO;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Map;

/**
 * Created by Martin on 2016/4/21.
 */
@Controller
public class FilesController {

    private static final File DOWNLOAD_HOME = new File("F:/Games");

    @RequestMapping(value = "/admin/files/list.html")
    public @ResponseBody JQGridResponse processListFiles(HttpServletRequest req, Model model,  String parentNode) {
        JQGridResponse resp = new JQGridResponse();
        if ("root".equals(parentNode)) {
//            FileDTO root = new FileDTO();
//            root.setName("/");
//            resp.getRows().add(root);
        } else {
            File template = getResFile(100L, "");
            Map<String, FileDTO> resMap = Maps.newLinkedHashMap();
            listFiles(template, resMap, 100L);
//            if (100L != orgID) {
//                File dir = getResFile(orgID, "");
//                listFiles(dir, resMap, orgID);
//            }
            resp.getRows().addAll(resMap.values());
        }
        return resp;
    }

    private void listFiles(File parentFile, Map<String, FileDTO> resMap, Long orgID) {
        if (!parentFile.exists() || !parentFile.isDirectory() || null == parentFile.listFiles()) {
            return;
        }
        for (File file : parentFile.listFiles()) {
            FileDTO resourceVo = new FileDTO(file, DOWNLOAD_HOME);
            resMap.put(file.getName(), resourceVo);
        }
    }

    String trimStart(String absPath, String prefix) {
        String result = absPath;
        if (result.startsWith(prefix)) {
            result = result.substring(prefix.length() + 1);
        }
        return result;
    }

    static File getResFile(Long orgID, String absPath) {
        return FileUtils.getFile(DOWNLOAD_HOME, absPath);
    }
}
