package org.grails.plugins.kml.utils


import grails.io.IOUtils
import grails.util.Holders
import groovy.time.TimeCategory
import groovy.util.logging.Slf4j
import org.apache.commons.codec.digest.DigestUtils
import org.apache.commons.io.FileUtils
import org.apache.commons.io.output.NullOutputStream
import org.springframework.web.multipart.MultipartFile

import java.security.DigestInputStream
import java.security.MessageDigest
import java.util.zip.ZipEntry
import java.util.zip.ZipOutputStream

@Slf4j
class Helper {

    public static String padNumber(Integer input) {
        return String.format("%02d", input)
    }





    public static Calendar getGregorianDate(Date date=null) {
        if (!date){
            date = new Date()
        }
        Calendar cal = Calendar.getInstance()
        cal.setTime(date)
        int week = cal.get(Calendar.WEEK_OF_YEAR)
        int year = cal.get(Calendar.YEAR)
        int month = cal.get(Calendar.MONTH)
        int day = cal.get(Calendar.DAY_OF_MONTH)
        final Calendar gd = new GregorianCalendar()
        gd.set(year, month, day)
        return gd

    }

    public static java.util.Date lastWeek(java.util.Date date) {
        use (TimeCategory) {
            return date-1.week
        }
    }

    public static java.util.Date lastMonth(java.util.Date date) {
        use (TimeCategory) {
            return date-1.month
        }
    }

    public static java.util.Date lastQuarter(java.util.Date date) {
        use (TimeCategory) {
            return date-3.months
        }
    }

    public static java.util.Date lastBiAnnually(java.util.Date date) {
        use (TimeCategory) {
            return date-6.months
        }
    }

    public static java.util.Date lastYear(java.util.Date date) {
        use(TimeCategory) {
            return date - 1.year
        }
    }

   // public static Logger log = LoggerFactory.getLogger(getClass().name)

    public static String  generateMD5(String s, int hashCode){
       String ss = "${s}${hashCode.toString()}"
        //Will return here later this is taking up too much time
        //return MessageDigest.getInstance("MD5").digest(s.bytes).encodeHex().toString()
        return MessageDigest.getInstance("MD5").digest(ss.bytes).encodeHex().toString()
    }

    //Ensure folder exists if not create it
    private static File verifyExists(String userPath) {
        File f = new File(userPath)
        if (!f.exists()) {
            f.mkdir()
        }
        return f
    }
    public static File mkDir(String userPath) {
        File f = new File(userPath)
        if (!f.exists()) {
            f.mkdirs()
        }
        return f
    }

    static void deleteAll(String fileFolder) throws IOException {
        File f = new File(fileFolder)
        if (f) {
            try {
                if (f.isDirectory()) {
                    FileUtils.deleteDirectory(f)
                    //for (File c : f.listFiles())
                    //  this.deleteAll(c);
                } else {
                    f.delete()
                }
            } catch (Throwable t) {
                log.error "${t.message}"
            }
        }
    }

    private static String getConfigPath(String name) {
        boolean isLinux = getConfig('osType') != 'windows'
        def userPath =getConfig(name) ?: (isLinux? '/tmp' : 'c:\\\\temp')
        File f = this.verifyExists(userPath)
        return (userPath+(isLinux ? '/' : '\\\\'))
    }

    static def getConfig(String configProperty) {
        Holders.grailsApplication.config.kmlplugin[configProperty] ?: ''
    }

    /**
     * Zip up a folder into a zip file
     * @param sourceFile
     * @param zipFile
     */
    public static void zipIt(String zipPath, String sourceFile, String zipFile) {
        List<String> fileList=[]
        fileList= this.generateFileList(fileList,sourceFile,new File(sourceFile));
        byte[] buffer = new byte[1024];
        String source = new File(sourceFile).getName();
        FileOutputStream fos = null;
        ZipOutputStream zos = null;
        try {
            fos = new FileOutputStream(zipPath+zipFile);
            zos = new ZipOutputStream(fos);
            log.info("Output to Zip : " + zipPath+zipFile);
            FileInputStream input = null;
            fileList?.each { file ->
                log.info("File Added : " + file);
                ZipEntry ze = new ZipEntry(source + File.separator + file);
                zos.putNextEntry(ze);
                try {
                    input = new FileInputStream(sourceFile + File.separator + file);
                    int len;
                    while ((len = input .read(buffer)) > 0) {
                        zos.write(buffer, 0, len);
                    }
                } finally {
                    input.close();
                }
            }
            zos.closeEntry();
            log.info("Folder successfully compressed");
        } catch (IOException ex) {
            ex.printStackTrace();
        } finally {
            try {
                zos.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
    /**
     * Parse through the current dir and add each file to provided files list
     * @param fileList
     * @param sourceFile
     * @param node
     * @return
     */
    public static List generateFileList( List<String> fileList,String sourceFile,File node) {
        if (node.isFile()) {
            def file = this.generateZipEntry(sourceFile,node.toString())
            fileList.add(file);
        }

        if (node.isDirectory()) {
            String[] subNote = node.list();
            for (String filename: subNote) {
                this.generateFileList(fileList,sourceFile,new File(node, filename));
            }
        }
        return fileList
    }
    //This is a file found in recursive lookup above
    private static String generateZipEntry(String sourceFile,String file) {
        return file.substring(sourceFile.length()+1, file.length());
    }

    public File convertMultiPartFileToFile(MultipartFile file) {
        File convFile = new File(file.getOriginalFilename())
        convFile.createNewFile()
        FileOutputStream fos = new FileOutputStream(convFile)
        fos.write(file.getBytes())
        fos.close()
        return convFile
    }


    public static String addClause(String where,String clause) {
        return (where ? where + ' and ' : 'where ') + clause
    }

    /**
     * will provide the decimal places of a given locale i.e.
     *
     * Helper.getDefaultFractionDigits(new ULocale('en,'GB'))
     *
     * uses com.ibm.icu.util.ULocale
     * @param locale
     * @return
     */
    public static int getDefaultFractionDigits(Locale locale) {
        if ( locale == null) {
            locale = Locale.getDefault()
        }
        Currency currency = Currency.getInstance( locale )
        if ( currency != null ) {
            return currency.getDefaultFractionDigits()
        }
        return 2
    }

    /**
     * Convert a number to alphh
     * @param i
     * @return
     *

     0 ->    A
     1 ->    B
     2 ->    C
     ...
     25 ->    Z
     26 ->   AA
     27 ->   AB
     28 ->   AC
     ...
     701 ->   ZZ
     702 ->  AAA
     */
    public static String toAlphabetic(int i) {
        if( i<0 ) {
            return "-"+toAlphabetic(-i-1);
        }

        int quot = i/26;
        int rem = i%26;
        char letter = (char)((int)'A' + rem);
        if( quot == 0 ) {
            return ""+letter;
        } else {
            return toAlphabetic(quot-1) + letter;
        }
    }

    public static String userCode(String username) {
        return base_convert(DigestUtils.shaHex(username), 16,32).substring(0,9).toUpperCase()
    }
    public static String base_convert(final String inputValue, final int fromBase, final int toBase) {
        return new BigInteger(inputValue, fromBase).toString(toBase)
    }

    public static boolean isUTF8(String input) {
        byte[] myBytes
        try {
            myBytes = input.getBytes("UTF-8");
        } catch (UnsupportedEncodingException e) {
        }
        return myBytes != null
    }

    public  static boolean containsHanScript(String s) {
        for (int i = 0; i < s.length(); ) {
            int codepoint = s.codePointAt(i);
            i += Character.charCount(codepoint);
            if (Character.UnicodeScript.of(codepoint) == Character.UnicodeScript.HAN) {
                return true;
            }
        }
        return false;
    }
    /**
     * Clean up process for photos
     * this moves the deleted file from users folder to users_folder/deleted/samephoto_systemtime
     *
     * If later a requirement to reduce disk usage -- these deleted folders can be targeted with no issues
     *
     * @param path
     * @param fileName
     */
    public static void deleteFile(String path, String toPath, String fileName) {
        InputStream inStream = null
        OutputStream outStream = null
        try {
            File file1 = new File(path+fileName)
            if (file1.exists() && !file1.isDirectory()) {
                File file2 = new File(toPath)
                file2.mkdirs()
                file2 = new File(toPath + fileName + "_" + (System.currentTimeMillis() as String))
                inStream = new FileInputStream(file1)
                outStream = new FileOutputStream(file2)
                byte[] buffer = new byte[1024]
                int length;
                //copy the file content in bytes
                while ((length = inStream.read(buffer)) > 0) {
                    outStream.write(buffer, 0, length)
                }
                inStream.close()
                outStream.close()
                file1.delete()
            }
        } catch(IOException e) {
            e.printStackTrace();
        }
    }

    public static String initialCapital(String s) {
       return s.substring(0,1).toUpperCase() + s.substring(1)
    }
    public static String initialLowerCase(String s) {
        return s.substring(0,1).toLowerCase() + s.substring(1)
    }
    public static String firstChar(String s) {
        return s.substring(0,1)
    }

    /**
     * paginate usage:
     * paginate(inputList,pagination-params)
     * paginationParams=[offset:params.offset,max:params.max]
     * instanceList=PaginationHelper.paginate(instanceList,paginationParams)
     * @param inputList
     * @param input
     * @return list split based on offset and max
     */
    public static List splitList(List inputList, Map input) {
        input.max =  input.max ? (input.max as int) : 1
        input.offset =  input.offset ? (input.offset as int) : 0
        if (input.max < 0 ) return inputList

        def instanceTotal = inputList?.size()
        if ( input.offset < 0 ||  input.offset > instanceTotal) {
            input.offset = 0
        }
        // Ensure pagination does not exceed from array size
        Integer borderNumber =  input.max +  input.offset
        if (borderNumber > instanceTotal) {
            borderNumber = instanceTotal
        }
        // Extract sublist based on pagination
        def objectSubList = inputList.subList(input.offset, borderNumber)
        return objectSubList
    }

    static String calculate(String algorithm, InputStream is) {
        return calculateAndCopy(algorithm, is, new NullOutputStream())
    }

    static String calculateAndCopy(String algorithm, InputStream is, OutputStream os) {
        MessageDigest digest = MessageDigest.getInstance(algorithm)
        DigestInputStream input = new DigestInputStream(is, digest)
        IOUtils.copy(input, os);
        String checksum= digest.digest().encodeHex().toString()
        os.close()
        input.close()
        return checksum
    }

    private static void copyDeleteFile(File source,String destination,String fileName, String usersname) throws IOException {
        try {
            String specificFolder=destination+fileName
            if (source.exists() && !source.isDirectory()) {
                File file2 = new File(specificFolder)
                if (!file2.exists()) {
                    file2.mkdirs()
                }
                File file3 = new File(specificFolder +"/"+ fileName + "_"+usersname+"_"+ (System.currentTimeMillis() as String)+".kml")
                FileInputStream inStream = new FileInputStream(source)
                FileOutputStream outStream = new FileOutputStream(file3)
                byte[] buffer = new byte[1024]
                int length;
                //copy the file content in bytes
                while ((length = inStream.read(buffer)) > 0) {
                    outStream.write(buffer, 0, length)
                }
                inStream.close()
                outStream.close()
                source.delete()
            }
        } catch(IOException e) {
            e.printStackTrace();
        }
    }

    public static  Map parseInput(String message){
        def results = message.tokenize(',').toList()
        String msg=results[0]
        String category,field2,f3,f4,f5
        if (results.size()>=1) {
            category = results[1]

        }
        if (results.size()>1) {
            field2 = results[2]
        }
        if (results.size()>2) {
            f3= results[3]
        }
        if (results.size()>3) {
            f4= results[4]
        }
        if (results.size()>4) {
            f5= results[5]
        }
        return [msgType:msg?.trim(), value:category?.trim(),mastercat:field2?.trim(), f3:f3?.trim(), f4:f4?.trim(),f5:f5?.trim()]
    }

    private static void copyFile(File source, File dest) throws IOException {
        FileUtils.copyFile(source, dest)
    }

    public static List<String> ls(String folder,String fileType, boolean recursive=false) {
        List<String> files=[]
        File file = new File(folder)
        File[] filesList = file.listFiles()
        for (File f : filesList) {
            if (f.isDirectory() && !f.isHidden() && recursive) {
                ls(f.name,fileType,recursive)
            }
            if(f.isFile() ){
                 files<< f.name
            }
        }
        return files
    }


    public static String parseHtml(content) {
        return content?.replaceAll("\\<.*?>","")?.replaceAll("\\&nbsp;"," ")?.replaceAll("<br>","\n")
    }
    static boolean netIsAvailable() {
        try {
            final URL url = new URL("http://www.google.com");
            final URLConnection conn = url.openConnection();
            conn.connect();
            return true;
        } catch (MalformedURLException e) {
            throw new RuntimeException(e);
        } catch (IOException e) {
            return false;
        }
    }
}
